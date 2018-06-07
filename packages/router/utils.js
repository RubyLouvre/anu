////////////////////////////////////////////////////////////////////////////////

// https://www.cnblogs.com/qinxingnet/p/6022024.html
function startsWith(string, search) {
    return string.slice(0, search.length) === search;
}
let reservedNames = ["uri", "path"];

export function invariant(condition, msg){
    if(!condition){
        throw msg;
    }
}

////////////////////////////////////////////////////////////////////////////////
// pick(routes, uri)
//
// Ranks and picks the best route to match. Each segment gets the highest
// amount of points, then the type of segment gets an additional amount of
// points where
//
//     static > dynamic > splat > root
//
// This way we don't have to worry about the order of our routes, let the
// computers do it.
//
// A route looks like this
//
//     { path, default, value }
//
// And a returned match looks like:
//
//     { route, params, uri }
//
// I know, I should use TypeScript not comments for these types.
function pick(routes, uri) {
    let match;
    let default_;

    let uriPathname = uri.split("?").shift();
    let uriSegments = segmentize(uriPathname);
    let isRootUri = uriSegments[0] === "";
    let ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
        let missed = false;
        let route = ranked[i].route;

        if (route.default) {
            default_ = {
                route,
                params: {},
                uri
            };
            continue;
        }

        let routeSegments = segmentize(route.path);
        let params = {};
        let max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
            let routeSegment = routeSegments[index];
            let uriSegment = uriSegments[index];

            let isSplat = routeSegment === "*";
            if (isSplat) {
                // Hit a splat, just grab the rest, and return a match
                // uri:   /files/documents/work
                // route: /files/*
                params["*"] = uriSegments
                    .slice(index)
                    .map(decodeURIComponent)
                    .join("/");
                break;
            }

            if (uriSegment === undefined) {
                // URI is shorter than the route, no match
                // uri:   /users
                // route: /users/:userId
                missed = true;
                break;
            }

            let dynamicMatch = paramRe.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                invariant(
                    !reservedNames.includes(dynamicMatch[1]),
                    `<Router> dynamic segment "${
                        dynamicMatch[1]
                    }" is a reserved name. Please use a different name in path "${
                        route.path
                    }".`
                );
                let value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                // Current segments don't match, not dynamic, not splat, so no match
                // uri:   /users/123/settings
                // route: /users/:id/profile
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                route,
                params,
                uri: "/" + uriSegments.slice(0, index).join("/")
            };
            break;
        }
    }

    return match || default_ || null;
}

////////////////////////////////////////////////////////////////////////////////
// match(path, uri) - Matches just one path to a uri, also lol
//分解第一个参数
function match(path, uri) {
    return pick([{ path }], uri);
}

////////////////////////////////////////////////////////////////////////////////
// resolve(to, basepath)
//
// Resolves URIs as though every path is a directory, no files.  Relative URIs
// in the browser can feel awkward because not only can you be "in a directory"
// you can be "at a file", too. For example
//
//     browserSpecResolve('foo', '/bar/') => /bar/foo
//     browserSpecResolve('foo', '/bar') => /foo
//
// But on the command line of a file system, it's not as complicated, you can't
// `cd` from a file, only directories.  This way, links have to know less about
// their current path. To go deeper you can do this:
//
//     <Link to="deeper"/>
//     // instead of
//     <Link to=`{${props.uri}/deeper}`/>
//
// Just like `cd`, if you want to go deeper from the command line, you do this:
//
//     cd deeper
//     # not
//     cd $(pwd)/deeper
//
// By treating every path as a directory, linking to relative paths should
// require less contextual information and (fingers crossed) be more intuitive.
function resolve(to, base) {
    // /foo/bar, /baz/qux => /foo/bar
    if (startsWith(to, "/")) {
        return to;
    }
    let _arr = to.split("?");
    let toPathname = _arr[0];
    let toQuery  = _arr[1];
    let basePathname = base.split("?").shift();

    let toSegments = segmentize(toPathname);
    let baseSegments = segmentize(basePathname);

    // ?a=b, /users?b=c => /users?a=b
    if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
    }

    // profile, /users/789 => /users/789/profile
    if (!startsWith(toSegments[0], ".")) {
        let pathname = baseSegments.concat(toSegments).join("/");
        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    }

    // ./         /users/123  =>  /users/123
    // ../        /users/123  =>  /users
    // ../..      /users/123  =>  /
    // ../../one  /a/b/c/d    =>  /a/b/one
    // .././one   /a/b/c/d    =>  /a/b/c/one
    let allSegments = baseSegments.concat(toSegments);
    let segments = [];
    for (let i = 0, n = allSegments.length; i < n; i++) {
        let segment = allSegments[i];
        if (segment === "..") {
            segments.pop();
        } else if (segment !== ".") {
            segments.push(segment);
        }
    }

    return addQuery("/" + segments.join("/"), toQuery);
}

////////////////////////////////////////////////////////////////////////////////
function insertParams(path, params) {
    let segments = segmentize(path);
    return (
        "/" +
    segments
        .map(segment => {
            let match = paramRe.exec(segment);
            return match ? params[match[1]] : segment;
        })
        .join("/")
    );
}

function validateRedirect (from, to)  {
    let filter = segment => isDynamic(segment);
    let fromString = segmentize(from)
        .filter(filter)
        .sort()
        .join("/");
    let toString = segmentize(to)
        .filter(filter)
        .sort()
        .join("/");
    return fromString === toString;
}

////////////////////////////////////////////////////////////////////////////////
// Junk
let paramRe = /^:(.+)/;

let SEGMENT_POINTS = 4;
let STATIC_POINTS = 3;
let DYNAMIC_POINTS = 2;
let SPLAT_PENALTY = 1; //Splat Arguments 参数数组化
let ROOT_POINTS = 1;

let isRootSegment = segment => segment == "";
let isDynamic = segment => paramRe.test(segment);
let isSplat = segment => segment === "*";
/**
 * 
Reach Router会对你的paths进行排名，因此你无需担心路径的顺序或传递props来告诉它怎么匹配。 
一般来说，你不应该担心这一点，你不管它，它也能做到你想要的效果。

但是，我知道你是一名程序员，你想知道它是如何工作的。

我们将路径切割成许多段，每段算出一个分数，然后全部相加，得最高分的路由定义将获胜。

1. 每个分段默认4分
1. 静态分段再加3分
2. 动态分段再加2分
3. 根分段再加1
4. 通配符分段减1分及**原来的4分**
https://reach.tech/router/ranking
*/
function rankRoute(route, index) {
    let score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;
            if (isRootSegment(segment)) {
                score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
                score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
                score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
                score += STATIC_POINTS;
            }
            return score;
        }, 0);
    return { route, score, index };
}
function sorter(a, b) {
    return a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index;
}
function rankRoutes(routes) {
    return routes.map(rankRoute).sort(sorter);
}
//去除前后的斜杠，并按/切割成数组
function segmentize( uri) {
    return uri.replace(/(^\/+|\/+$)/g, "").split("/");
}

function addQuery (pathname, query) {
    return pathname + (query ? `?${query}` : ""); 
}



////////////////////////////////////////////////////////////////////////////////
export { startsWith, pick, match, resolve, insertParams, validateRedirect };
