import { NodePath } from '@babel/core';
import * as t from '@babel/types';
declare const visitor: {
    ClassDeclaration: any;
    ClassExpression: any;
    ClassMethod: {
        enter(astPath: NodePath<t.ClassMethod>, state: any): void;
        exit(astPath: NodePath<t.ClassMethod>, state: any): void;
    };
    FunctionDeclaration: {
        exit(astPath: NodePath<t.FunctionDeclaration>, state: any): void;
    };
    ImportDeclaration(astPath: NodePath<t.ImportDeclaration>, state: any): void;
    Program: {
        exit(astPath: NodePath<t.Program>, state: any): void;
    };
    ExportDefaultDeclaration: {
        exit(astPath: NodePath<t.ExportDefaultDeclaration>, state: any): void;
    };
    ExportNamedDeclaration: {
        exit(astPath: NodePath<t.ExportNamedDeclaration>): void;
    };
    ThisExpression: {
        exit(astPath: NodePath<t.ThisExpression>, state: any): void;
    };
    MemberExpression(astPath: NodePath<t.MemberExpression>, state: any): void;
    CallExpression: {
        enter(astPath: NodePath<t.CallExpression>, state: any): void;
        exit(astPath: NodePath<t.CallExpression>, state: any): void;
    };
    JSXElement(astPath: NodePath<t.JSXElement>): void;
    JSXOpeningElement: {
        enter: (astPath: NodePath<t.JSXOpeningElement>, state: any) => void;
    };
    JSXClosingElement: (astPath: NodePath<t.JSXClosingElement>) => void;
    JSXAttribute: {
        enter: (astPath: NodePath<t.JSXAttribute>, state: any) => void;
    };
    JSXText(astPath: NodePath<t.JSXText>): void;
    JSXExpressionContainer(astPath: NodePath<t.JSXExpressionContainer>): void;
};
export default visitor;
