/**
 * @fileoverview Rule to insert/remove semicolons, based on the original ESLint
 *               semi rule.
 *
 * @author Nicholas C. Zakas
 * @author Evan You
 */
"use strict"

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

  var OPT_OUT_PATTERN = /[\[\(\/\+\-]/
  var always = context.options[0] !== 'remove'
  var leading = context.options[1] === true

  // keep track of removed token positions to avoid double-adding/removing
  var addedPositions = {}
  var removedPositions = {}

  var specialStatementParentTypes = {
    IfStatement: true,
    WhileStatement: true,
    ForStatement: true,
    ForInStatement: true,
    ForOfStatement: true,
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------

  function toKey (location) {
    return location.line + ',' + location.column
  }

  function add (node, location) {
    var key = toKey(location)
    if (!addedPositions[key]) {
      addedPositions[key] = true
      context.report(node, location, "ADD")
    }
  }

  function remove (node, location) {
    var key = toKey(location)
    if (!removedPositions[key]) {
      removedPositions[key] = true
      context.report(node, location, "REMOVE")
    }
  }

  /**
   * Check if a semicolon is removable. We should only remove the semicolon if:
   *   - next token is a statement divider ("}" or ";")
   *   - next token is on a new line
   *
   * @param {Token} last
   * @param {Token} next
   */
  function isRemovable (last, next) {
    var lastTokenLine = last.loc.end.line
    var nextTokenLine = next && next.loc.start.line
    var isDivider = next && (next.value === '}' || next.value === ';')
    return isDivider || (lastTokenLine !== nextTokenLine)
  }

  /**
   * Checks a node to see if it's followed by a semicolon.
   *
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolon(node) {

    var firstToken = context.getFirstToken(node)
    var lastToken = context.getLastToken(node)
    var prevToken = context.getTokenBefore(node)
    var nextToken = context.getTokenAfter(node)
    var isSpecialNewLine = nextToken && OPT_OUT_PATTERN.test(nextToken.value)

    if (always) {
      // ADD
      var added = false
      if (lastToken.type !== "Punctuator" || lastToken.value !== ";") {
        // missing semi. add semi after last token of current statement
        add(node, lastToken.loc.end)
        added = true
      }
      if (isSpecialNewLine) {
        if (lastToken.value === ';') {
          // removing semi from last token of current statement
          remove(node, lastToken.loc.end)
          lastToken = context.getLastToken(node, 1)
        }
        // don't add again if we already added a semicolon
        if (!added) {
          // add semi to second last token of current statement
          add(node, lastToken.loc.end)
        }
      }
    } else {
      // REMOVE
      if (
        lastToken.type === "Punctuator" &&
        lastToken.value === ";" &&
        isRemovable(lastToken, nextToken)
      ) {
        remove(node, node.loc.end)
        if (!leading && isSpecialNewLine) {
          add(nextToken, nextToken.loc.start)
        }
      }
      // add leading semicolon if:
      if (
        // leading option is true
        leading &&
        // is on a newline
        (!prevToken || firstToken.loc.start.line !== prevToken.loc.end.line) &&
        // starts with special leading token
        OPT_OUT_PATTERN.test(firstToken.value) &&
        // is not the only child statement of if/for/while statements
        !specialStatementParentTypes[node.parent.type]
      ) {
        add(node, firstToken.loc.start)
      }
    }
  }

  /**
   * Checks to see if there's a semicolon after a variable declaration,
   * but only if the declaration is not within a for... statement.
   *
   * e.g. for (var i = 0; i < 10; i++) ...
   *
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolonForVariableDeclaration(node) {

    var ancestors = context.getAncestors()
    var parentIndex = ancestors.length - 1
    var parent = ancestors[parentIndex]

    if (
      (parent.type !== "ForStatement" || parent.init !== node) &&
      (parent.type !== "ForInStatement" || parent.left !== node) &&
      (parent.type !== "ForOfStatement" || parent.left !== node)
    ) {
      checkForSemicolon(node)
    }
  }

  /**
   * Check an empty statement to remove ecessive or add leading semicolons.
   *
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkEmptyStatement (node) {
    var lastToken = context.getLastToken(node)
    var nextToken = context.getTokenAfter(node) || context.getLastToken(node)
    var isSpecialNewLine = nextToken && OPT_OUT_PATTERN.test(nextToken.value)
    if (
      (always || isRemovable(lastToken, nextToken)) &&
      !specialStatementParentTypes[node.parent.type]
    ) {
      remove(node, node.loc.end)
      if (!always && leading && isSpecialNewLine) {
        add(nextToken, nextToken.loc.start)
      }
    }
  }

  //--------------------------------------------------------------------------
  // Public API
  //--------------------------------------------------------------------------

  return {
    "ExpressionStatement": checkForSemicolon,
    "ReturnStatement": checkForSemicolon,
    "DebuggerStatement": checkForSemicolon,
    "BreakStatement": checkForSemicolon,
    "ContinueStatement": checkForSemicolon,
    "DoWhileStatement": checkForSemicolon,
    "ThrowStatement": checkForSemicolon,
    // empty statement
    "EmptyStatement": checkEmptyStatement,
    // variable declaration
    "VariableDeclaration": checkForSemicolonForVariableDeclaration,
    // ES6 additions
    "ImportDeclaration": checkForSemicolon,
    "ExportDefaultDeclaration": checkForSemicolon,
    "ExportNamedDeclaration": checkForSemicolon,
    "ExportAllDeclaration": checkForSemicolon
  }

}
