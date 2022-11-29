import acorn from '../../dist/acorn.esm.js';
import {
    describe,
    it
} from 'mocha';
import {
    expect,
    use,
} from 'chai';

import chaiProperties from 'chai-properties';
use(chaiProperties);

let index = 0;

describe('acorn-x code 基础测试', () => {
    const test = (code, correctAst, options) => {
        it(`成功测试${index++}`, () => {
            const ast = acorn.parse(code, { ...options, locations: true });
            expect(ast).to.deep.have.properties(correctAst);
        }).timeout(5000);
    }

    test("{ doThis(); doThat(); }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "doThis",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 2
                                },
                                end: {
                                    line: 1,
                                    column: 8
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 2
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 11
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "doThat",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 12
                                },
                                end: {
                                    line: 1,
                                    column: 18
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 12
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 12
                        },
                        end: {
                            line: 1,
                            column: 21
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 23
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 23
            }
        }
    });

    test("{}", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 2
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 2
            }
        }
    });

    test("var x", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                init: null,
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 5
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 5
            }
        }
    });

    test("var x, y;", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 5
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "y",
                        loc: {
                            start: {
                                line: 1,
                                column: 7
                            },
                            end: {
                                line: 1,
                                column: 8
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 7
                        },
                        end: {
                            line: 1,
                            column: 8
                        }
                    }
                }
            ],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 9
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 9
            }
        }
    });

    test("var x = 42", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                init: {
                    type: "Literal",
                    value: 42,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 10
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 10
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 10
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 10
            }
        }
    });

    test("var eval = 42, arguments = 42", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "eval",
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 8
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 42,
                        loc: {
                            start: {
                                line: 1,
                                column: 11
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "arguments",
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 42,
                        loc: {
                            start: {
                                line: 1,
                                column: 27
                            },
                            end: {
                                line: 1,
                                column: 29
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 29
                        }
                    }
                }
            ],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 29
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 29
            }
        }
    });

    test("var x = 14, y = 3, z = 1977", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 5
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 14,
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 10
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "y",
                        loc: {
                            start: {
                                line: 1,
                                column: 12
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 3,
                        loc: {
                            start: {
                                line: 1,
                                column: 16
                            },
                            end: {
                                line: 1,
                                column: 17
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 12
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "z",
                        loc: {
                            start: {
                                line: 1,
                                column: 19
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 1977,
                        loc: {
                            start: {
                                line: 1,
                                column: 23
                            },
                            end: {
                                line: 1,
                                column: 27
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 27
                        }
                    }
                }
            ],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 27
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 27
            }
        }
    });

    test("var implements, interface, package", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "implements",
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 14
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 14
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "interface",
                        loc: {
                            start: {
                                line: 1,
                                column: 16
                            },
                            end: {
                                line: 1,
                                column: 25
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 16
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "package",
                        loc: {
                            start: {
                                line: 1,
                                column: 27
                            },
                            end: {
                                line: 1,
                                column: 34
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 27
                        },
                        end: {
                            line: 1,
                            column: 34
                        }
                    }
                }
            ],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 34
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 34
            }
        }
    });

    test("var private, protected, public, static", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "private",
                        loc: {
                            start: {
                                line: 1,
                                column: 4
                            },
                            end: {
                                line: 1,
                                column: 11
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 11
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "protected",
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 22
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "public",
                        loc: {
                            start: {
                                line: 1,
                                column: 24
                            },
                            end: {
                                line: 1,
                                column: 30
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 24
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    }
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "static",
                        loc: {
                            start: {
                                line: 1,
                                column: 32
                            },
                            end: {
                                line: 1,
                                column: 38
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 32
                        },
                        end: {
                            line: 1,
                            column: 38
                        }
                    }
                }
            ],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 38
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 38
            }
        }
    });

    test(";", {
        type: "Program",
        body: [{
            type: "EmptyStatement",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 1
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 1
            }
        }
    });

    test("x", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "Identifier",
                name: "x",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 1
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 1
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 1
            }
        }
    });

    test("x, y", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "SequenceExpression",
                expressions: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 0
                            },
                            end: {
                                line: 1,
                                column: 1
                            }
                        }
                    },
                    {
                        type: "Identifier",
                        name: "y",
                        loc: {
                            start: {
                                line: 1,
                                column: 3
                            },
                            end: {
                                line: 1,
                                column: 4
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 4
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 4
            }
        }
    });

    test("\\u0061", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "Identifier",
                name: "a",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 6
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 6
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 6
            }
        }
    });

    test("a\\u0061", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "Identifier",
                name: "aa",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 7
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 7
            }
        }
    });

    test("if (morning) goodMorning()", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Identifier",
                name: "morning",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            consequent: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "goodMorning",
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 26
                    }
                }
            },
            alternate: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 26
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 26
            }
        }
    });

    test("if (morning) (function(){})", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Identifier",
                name: "morning",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            consequent: {
                type: "ExpressionStatement",
                expression: {
                    type: "FunctionExpression",
                    id: null,
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 24
                            },
                            end: {
                                line: 1,
                                column: 26
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 14
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            alternate: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 27
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 27
            }
        }
    });

    test("if (morning) var x = 0;", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Identifier",
                name: "morning",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            consequent: {
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 17
                            },
                            end: {
                                line: 1,
                                column: 18
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 0,
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 17
                        },
                        end: {
                            line: 1,
                            column: 22
                        }
                    }
                }],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 23
                    }
                }
            },
            alternate: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 23
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 23
            }
        }
    });

    test("if (morning) function a(){}", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Identifier",
                name: "morning",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            consequent: {
                type: "FunctionDeclaration",
                id: {
                    type: "Identifier",
                    name: "a",
                    loc: {
                        start: {
                            line: 1,
                            column: 22
                        },
                        end: {
                            line: 1,
                            column: 23
                        }
                    }
                },
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 25
                        },
                        end: {
                            line: 1,
                            column: 27
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            alternate: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 27
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 27
            }
        }
    });

    test("if (morning) goodMorning(); else goodDay()", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Identifier",
                name: "morning",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            consequent: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "goodMorning",
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            alternate: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "goodDay",
                        loc: {
                            start: {
                                line: 1,
                                column: 33
                            },
                            end: {
                                line: 1,
                                column: 40
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 33
                        },
                        end: {
                            line: 1,
                            column: 42
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 33
                    },
                    end: {
                        line: 1,
                        column: 42
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 42
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 42
            }
        }
    });

    test("do keep(); while (true)", {
        type: "Program",
        body: [{
            type: "DoWhileStatement",
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "keep",
                        loc: {
                            start: {
                                line: 1,
                                column: 3
                            },
                            end: {
                                line: 1,
                                column: 7
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 3
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 3
                    },
                    end: {
                        line: 1,
                        column: 10
                    }
                }
            },
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 23
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 23
            }
        }
    });

    test("do keep(); while (true);", {
        type: "Program",
        body: [{
            type: "DoWhileStatement",
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "keep",
                        loc: {
                            start: {
                                line: 1,
                                column: 3
                            },
                            end: {
                                line: 1,
                                column: 7
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 3
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 3
                    },
                    end: {
                        line: 1,
                        column: 10
                    }
                }
            },
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 24
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 24
            }
        }
    });

    test("do { x++; y--; } while (x < 10)", {
        type: "Program",
        body: [{
            type: "DoWhileStatement",
            body: {
                type: "BlockStatement",
                body: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "UpdateExpression",
                            operator: "++",
                            prefix: false,
                            argument: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 5
                                    },
                                    end: {
                                        line: 1,
                                        column: 6
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 5
                                },
                                end: {
                                    line: 1,
                                    column: 8
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 9
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "UpdateExpression",
                            operator: "--",
                            prefix: false,
                            argument: {
                                type: "Identifier",
                                name: "y",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 10
                                    },
                                    end: {
                                        line: 1,
                                        column: 11
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 10
                                },
                                end: {
                                    line: 1,
                                    column: 13
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 10
                            },
                            end: {
                                line: 1,
                                column: 14
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 3
                    },
                    end: {
                        line: 1,
                        column: 16
                    }
                }
            },
            test: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 24
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    }
                },
                operator: "<",
                right: {
                    type: "Literal",
                    value: 10,
                    loc: {
                        start: {
                            line: 1,
                            column: 28
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 24
                    },
                    end: {
                        line: 1,
                        column: 30
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 31
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 31
            }
        }
    });

    test("{ do { } while (false);false }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "DoWhileStatement",
                    body: {
                        type: "BlockStatement",
                        body: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 5
                            },
                            end: {
                                line: 1,
                                column: 8
                            }
                        }
                    },
                    test: {
                        type: "Literal",
                        value: false,
                        loc: {
                            start: {
                                line: 1,
                                column: 16
                            },
                            end: {
                                line: 1,
                                column: 21
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 23
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Literal",
                        value: false,
                        loc: {
                            start: {
                                line: 1,
                                column: 23
                            },
                            end: {
                                line: 1,
                                column: 28
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 23
                        },
                        end: {
                            line: 1,
                            column: 28
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 30
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 30
            }
        }
    });

    test("while (true) doSomething()", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "doSomething",
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    },
                    arguments: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 26
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 26
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 26
            }
        }
    });

    test("while (x < 10) { x++; y--; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 7
                        },
                        end: {
                            line: 1,
                            column: 8
                        }
                    }
                },
                operator: "<",
                right: {
                    type: "Literal",
                    value: 10,
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "UpdateExpression",
                            operator: "++",
                            prefix: false,
                            argument: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 17
                                    },
                                    end: {
                                        line: 1,
                                        column: 18
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 17
                                },
                                end: {
                                    line: 1,
                                    column: 20
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 17
                            },
                            end: {
                                line: 1,
                                column: 21
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "UpdateExpression",
                            operator: "--",
                            prefix: false,
                            argument: {
                                type: "Identifier",
                                name: "y",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 22
                                    },
                                    end: {
                                        line: 1,
                                        column: 23
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 22
                                },
                                end: {
                                    line: 1,
                                    column: 25
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 22
                            },
                            end: {
                                line: 1,
                                column: 26
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 15
                    },
                    end: {
                        line: 1,
                        column: 28
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 28
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 28
            }
        }
    });

    test("for(;;);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: null,
            test: null,
            update: null,
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 8
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 8
            }
        }
    });

    test("for(;;){}", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: null,
            test: null,
            update: null,
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 9
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 9
            }
        }
    });

    test("for(x = 0;;);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                right: {
                    type: "Literal",
                    value: 0,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            test: null,
            update: null,
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 12
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 13
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 13
            }
        }
    });

    test("for(var x = 0;;);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 9
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 0,
                        loc: {
                            start: {
                                line: 1,
                                column: 12
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                }],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            test: null,
            update: null,
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 16
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 17
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 17
            }
        }
    });

    test("for(var x = 0, y = 1;;);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "VariableDeclaration",
                declarations: [{
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: "x",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 8
                                },
                                end: {
                                    line: 1,
                                    column: 9
                                }
                            }
                        },
                        init: {
                            type: "Literal",
                            value: 0,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 12
                                },
                                end: {
                                    line: 1,
                                    column: 13
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    {
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: "y",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 15
                                },
                                end: {
                                    line: 1,
                                    column: 16
                                }
                            }
                        },
                        init: {
                            type: "Literal",
                            value: 1,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 19
                                },
                                end: {
                                    line: 1,
                                    column: 20
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    }
                ],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 20
                    }
                }
            },
            test: null,
            update: null,
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 23
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 24
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 24
            }
        }
    });

    test("for(x = 0; x < 42;);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                right: {
                    type: "Literal",
                    value: 0,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            test: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 12
                        }
                    }
                },
                operator: "<",
                right: {
                    type: "Literal",
                    value: 42,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 11
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            update: null,
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 19
                    },
                    end: {
                        line: 1,
                        column: 20
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 20
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 20
            }
        }
    });

    test("for(x = 0; x < 42; x++);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                right: {
                    type: "Literal",
                    value: 0,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            test: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 12
                        }
                    }
                },
                operator: "<",
                right: {
                    type: "Literal",
                    value: 42,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 11
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            update: {
                type: "UpdateExpression",
                operator: "++",
                prefix: false,
                argument: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 20
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 19
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            body: {
                type: "EmptyStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 23
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 24
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 24
            }
        }
    });

    test("for(x = 0; x < 42; x++) process(x);", {
        type: "Program",
        body: [{
            type: "ForStatement",
            init: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                right: {
                    type: "Literal",
                    value: 0,
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            test: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 12
                        }
                    }
                },
                operator: "<",
                right: {
                    type: "Literal",
                    value: 42,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 11
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            update: {
                type: "UpdateExpression",
                operator: "++",
                prefix: false,
                argument: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 20
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 19
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "process",
                        loc: {
                            start: {
                                line: 1,
                                column: 24
                            },
                            end: {
                                line: 1,
                                column: 31
                            }
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 32
                            },
                            end: {
                                line: 1,
                                column: 33
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 24
                        },
                        end: {
                            line: 1,
                            column: 34
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 24
                    },
                    end: {
                        line: 1,
                        column: 35
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 35
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 35
            }
        }
    });

    test("for(x in list) process(x);", {
        type: "Program",
        body: [{
            type: "ForInStatement",
            left: {
                type: "Identifier",
                name: "x",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                }
            },
            right: {
                type: "Identifier",
                name: "list",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "process",
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 23
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 15
                    },
                    end: {
                        line: 1,
                        column: 26
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 26
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 26
            }
        }
    });

    test("for (var x in list) process(x);", {
        type: "Program",
        body: [{
            type: "ForInStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 9
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    },
                    init: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 10
                        }
                    }
                }],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 5
                    },
                    end: {
                        line: 1,
                        column: 10
                    }
                }
            },
            right: {
                type: "Identifier",
                name: "list",
                loc: {
                    start: {
                        line: 1,
                        column: 14
                    },
                    end: {
                        line: 1,
                        column: 18
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "process",
                        loc: {
                            start: {
                                line: 1,
                                column: 20
                            },
                            end: {
                                line: 1,
                                column: 27
                            }
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 28
                            },
                            end: {
                                line: 1,
                                column: 29
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 20
                        },
                        end: {
                            line: 1,
                            column: 30
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 20
                    },
                    end: {
                        line: 1,
                        column: 31
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 31
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 31
            }
        }
    });

    test("for (var x = 42 in list) process(x);", {
        type: "Program",
        body: [{
            type: "ForInStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 9
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 42,
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 15
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 15
                        }
                    }
                }],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 5
                    },
                    end: {
                        line: 1,
                        column: 15
                    }
                }
            },
            right: {
                type: "Identifier",
                name: "list",
                loc: {
                    start: {
                        line: 1,
                        column: 19
                    },
                    end: {
                        line: 1,
                        column: 23
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "process",
                        loc: {
                            start: {
                                line: 1,
                                column: 25
                            },
                            end: {
                                line: 1,
                                column: 32
                            }
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 33
                            },
                            end: {
                                line: 1,
                                column: 34
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 25
                        },
                        end: {
                            line: 1,
                            column: 35
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 25
                    },
                    end: {
                        line: 1,
                        column: 36
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 36
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 36
            }
        }
    });

    test("for (var i = function() { return 10 in [] } in list) process(x);", {
        type: "Program",
        body: [{
            type: "ForInStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "i",
                        loc: {
                            start: {
                                line: 1,
                                column: 9
                            },
                            end: {
                                line: 1,
                                column: 10
                            }
                        }
                    },
                    init: {
                        type: "FunctionExpression",
                        id: null,
                        params: [],
                        body: {
                            type: "BlockStatement",
                            body: [{
                                type: "ReturnStatement",
                                argument: {
                                    type: "BinaryExpression",
                                    left: {
                                        type: "Literal",
                                        value: 10,
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 33
                                            },
                                            end: {
                                                line: 1,
                                                column: 35
                                            }
                                        }
                                    },
                                    operator: "in",
                                    right: {
                                        type: "ArrayExpression",
                                        elements: [],
                                        loc: {
                                            start: {
                                                line: 1,
                                                column: 39
                                            },
                                            end: {
                                                line: 1,
                                                column: 41
                                            }
                                        }
                                    },
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 33
                                        },
                                        end: {
                                            line: 1,
                                            column: 41
                                        }
                                    }
                                },
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 26
                                    },
                                    end: {
                                        line: 1,
                                        column: 41
                                    }
                                }
                            }],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 24
                                },
                                end: {
                                    line: 1,
                                    column: 43
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 43
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 43
                        }
                    }
                }],
                kind: "var",
                loc: {
                    start: {
                        line: 1,
                        column: 5
                    },
                    end: {
                        line: 1,
                        column: 43
                    }
                }
            },
            right: {
                type: "Identifier",
                name: "list",
                loc: {
                    start: {
                        line: 1,
                        column: 47
                    },
                    end: {
                        line: 1,
                        column: 51
                    }
                }
            },
            body: {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "process",
                        loc: {
                            start: {
                                line: 1,
                                column: 53
                            },
                            end: {
                                line: 1,
                                column: 60
                            }
                        }
                    },
                    arguments: [{
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 61
                            },
                            end: {
                                line: 1,
                                column: 62
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 53
                        },
                        end: {
                            line: 1,
                            column: 63
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 53
                    },
                    end: {
                        line: 1,
                        column: 64
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 64
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 64
            }
        }
    });

    test("while (true) { continue; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                    type: "ContinueStatement",
                    label: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 24
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 26
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 26
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 26
            }
        }
    });

    test("while (true) { continue }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                    type: "ContinueStatement",
                    label: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 23
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 25
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 25
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 25
            }
        }
    });

    test("done: while (true) { continue done }", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "WhileStatement",
                test: {
                    type: "Literal",
                    value: true,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ContinueStatement",
                        label: {
                            type: "Identifier",
                            name: "done",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 34
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 34
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 36
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 36
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "done",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 36
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 36
            }
        }
    });

    test("done: while (true) { continue done; }", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "WhileStatement",
                test: {
                    type: "Literal",
                    value: true,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ContinueStatement",
                        label: {
                            type: "Identifier",
                            name: "done",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 34
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 35
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 37
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 37
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "done",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 37
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 37
            }
        }
    });

    test("while (true) { break }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                    type: "BreakStatement",
                    label: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 20
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 22
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 22
            }
        }
    });

    test("done: while (true) { break done }", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "WhileStatement",
                test: {
                    type: "Literal",
                    value: true,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "BreakStatement",
                        label: {
                            type: "Identifier",
                            name: "done",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 27
                                },
                                end: {
                                    line: 1,
                                    column: 31
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 31
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 33
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "done",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 33
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 33
            }
        }
    });

    test("done: while (true) { break done; }", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "WhileStatement",
                test: {
                    type: "Literal",
                    value: true,
                    loc: {
                        start: {
                            line: 1,
                            column: 13
                        },
                        end: {
                            line: 1,
                            column: 17
                        }
                    }
                },
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "BreakStatement",
                        label: {
                            type: "Identifier",
                            name: "done",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 27
                                },
                                end: {
                                    line: 1,
                                    column: 31
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 32
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 34
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 34
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "done",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 34
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 34
            }
        }
    });

    test("(function(){ return })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ReturnStatement",
                        argument: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 19
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 21
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 21
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 22
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 22
            }
        }
    });

    test("(function(){ return; })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ReturnStatement",
                        argument: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 22
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 22
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 23
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 23
            }
        }
    });

    test("(function(){ return x; })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ReturnStatement",
                        argument: {
                            type: "Identifier",
                            name: "x",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 20
                                },
                                end: {
                                    line: 1,
                                    column: 21
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 24
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 25
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 25
            }
        }
    });

    test("(function(){ return x * y })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ReturnStatement",
                        argument: {
                            type: "BinaryExpression",
                            left: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 20
                                    },
                                    end: {
                                        line: 1,
                                        column: 21
                                    }
                                }
                            },
                            operator: "*",
                            right: {
                                type: "Identifier",
                                name: "y",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 24
                                    },
                                    end: {
                                        line: 1,
                                        column: 25
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 20
                                },
                                end: {
                                    line: 1,
                                    column: 25
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 1,
                                column: 25
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 27
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 28
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 28
            }
        }
    });

    test("switch (x) {}", {
        type: "Program",
        body: [{
            type: "SwitchStatement",
            discriminant: {
                type: "Identifier",
                name: "x",
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 9
                    }
                }
            },
            cases: [],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 13
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 13
            }
        }
    });

    test("switch (answer) { case 42: hi(); break; }", {
        type: "Program",
        body: [{
            type: "SwitchStatement",
            discriminant: {
                type: "Identifier",
                name: "answer",
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            cases: [{
                type: "SwitchCase",
                consequent: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "Identifier",
                                name: "hi",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 27
                                    },
                                    end: {
                                        line: 1,
                                        column: 29
                                    }
                                }
                            },
                            arguments: [],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 27
                                },
                                end: {
                                    line: 1,
                                    column: 31
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 27
                            },
                            end: {
                                line: 1,
                                column: 32
                            }
                        }
                    },
                    {
                        type: "BreakStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 33
                            },
                            end: {
                                line: 1,
                                column: 39
                            }
                        }
                    }
                ],
                test: {
                    type: "Literal",
                    value: 42,
                    loc: {
                        start: {
                            line: 1,
                            column: 23
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 39
                    }
                }
            }],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 41
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 41
            }
        }
    });

    test("switch (answer) { case 42: hi(); break; default: break }", {
        type: "Program",
        body: [{
            type: "SwitchStatement",
            discriminant: {
                type: "Identifier",
                name: "answer",
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            cases: [{
                    type: "SwitchCase",
                    consequent: [{
                            type: "ExpressionStatement",
                            expression: {
                                type: "CallExpression",
                                callee: {
                                    type: "Identifier",
                                    name: "hi",
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 27
                                        },
                                        end: {
                                            line: 1,
                                            column: 29
                                        }
                                    }
                                },
                                arguments: [],
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 27
                                    },
                                    end: {
                                        line: 1,
                                        column: 31
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 27
                                },
                                end: {
                                    line: 1,
                                    column: 32
                                }
                            }
                        },
                        {
                            type: "BreakStatement",
                            label: null,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 33
                                },
                                end: {
                                    line: 1,
                                    column: 39
                                }
                            }
                        }
                    ],
                    test: {
                        type: "Literal",
                        value: 42,
                        loc: {
                            start: {
                                line: 1,
                                column: 23
                            },
                            end: {
                                line: 1,
                                column: 25
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 39
                        }
                    }
                },
                {
                    type: "SwitchCase",
                    consequent: [{
                        type: "BreakStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 49
                            },
                            end: {
                                line: 1,
                                column: 54
                            }
                        }
                    }],
                    test: null,
                    loc: {
                        start: {
                            line: 1,
                            column: 40
                        },
                        end: {
                            line: 1,
                            column: 54
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 56
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 56
            }
        }
    });

    test("start: for (;;) break start", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "ForStatement",
                init: null,
                test: null,
                update: null,
                body: {
                    type: "BreakStatement",
                    label: {
                        type: "Identifier",
                        name: "start",
                        loc: {
                            start: {
                                line: 1,
                                column: 22
                            },
                            end: {
                                line: 1,
                                column: 27
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 16
                        },
                        end: {
                            line: 1,
                            column: 27
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "start",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 27
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 27
            }
        }
    });

    test("start: while (true) break start", {
        type: "Program",
        body: [{
            type: "LabeledStatement",
            body: {
                type: "WhileStatement",
                test: {
                    type: "Literal",
                    value: true,
                    loc: {
                        start: {
                            line: 1,
                            column: 14
                        },
                        end: {
                            line: 1,
                            column: 18
                        }
                    }
                },
                body: {
                    type: "BreakStatement",
                    label: {
                        type: "Identifier",
                        name: "start",
                        loc: {
                            start: {
                                line: 1,
                                column: 26
                            },
                            end: {
                                line: 1,
                                column: 31
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 20
                        },
                        end: {
                            line: 1,
                            column: 31
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 31
                    }
                }
            },
            label: {
                type: "Identifier",
                name: "start",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 31
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 31
            }
        }
    });

    test("throw x;", {
        type: "Program",
        body: [{
            type: "ThrowStatement",
            argument: {
                type: "Identifier",
                name: "x",
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 8
            }
        }
    });

    test("throw x * y", {
        type: "Program",
        body: [{
            type: "ThrowStatement",
            argument: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 6
                        },
                        end: {
                            line: 1,
                            column: 7
                        }
                    }
                },
                operator: "*",
                right: {
                    type: "Identifier",
                    name: "y",
                    loc: {
                        start: {
                            line: 1,
                            column: 10
                        },
                        end: {
                            line: 1,
                            column: 11
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 11
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 11
            }
        }
    });

    test("throw { message: \"Error\" }", {
        type: "Program",
        body: [{
            type: "ThrowStatement",
            argument: {
                type: "ObjectExpression",
                properties: [{
                    type: "Property",
                    key: {
                        type: "Identifier",
                        name: "message",
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 15
                            }
                        }
                    },
                    value: {
                        type: "Literal",
                        value: "Error",
                        loc: {
                            start: {
                                line: 1,
                                column: 17
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        }
                    },
                    kind: "init"
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 6
                    },
                    end: {
                        line: 1,
                        column: 26
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 26
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 26
            }
        }
    });

    test("try { } catch (e) { }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "e",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 16
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 21
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 21
                    }
                }
            },
            finalizer: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 21
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 21
            }
        }
    });

    test("try { } catch (eval) { }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "eval",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 19
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 21
                        },
                        end: {
                            line: 1,
                            column: 24
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            finalizer: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 24
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 24
            }
        }
    });

    test("try { } catch (arguments) { }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "arguments",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 24
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 26
                        },
                        end: {
                            line: 1,
                            column: 29
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 29
                    }
                }
            },
            finalizer: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 29
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 29
            }
        }
    });

    test("try { } catch (e) { say(e) }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "e",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 16
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "Identifier",
                                name: "say",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 20
                                    },
                                    end: {
                                        line: 1,
                                        column: 23
                                    }
                                }
                            },
                            arguments: [{
                                type: "Identifier",
                                name: "e",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 24
                                    },
                                    end: {
                                        line: 1,
                                        column: 25
                                    }
                                }
                            }],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 20
                                },
                                end: {
                                    line: 1,
                                    column: 26
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 20
                            },
                            end: {
                                line: 1,
                                column: 26
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 28
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 28
                    }
                }
            },
            finalizer: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 28
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 28
            }
        }
    });

    test("try { } finally { cleanup(stuff) }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 7
                    }
                }
            },
            handler: null,
            finalizer: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "cleanup",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 18
                                },
                                end: {
                                    line: 1,
                                    column: 25
                                }
                            }
                        },
                        arguments: [{
                            type: "Identifier",
                            name: "stuff",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 26
                                },
                                end: {
                                    line: 1,
                                    column: 31
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 18
                            },
                            end: {
                                line: 1,
                                column: 32
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 32
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 16
                    },
                    end: {
                        line: 1,
                        column: 34
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 34
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 34
            }
        }
    });

    test("try { doThat(); } catch (e) { say(e) }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "doThat",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 6
                                },
                                end: {
                                    line: 1,
                                    column: 12
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 6
                            },
                            end: {
                                line: 1,
                                column: 14
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 6
                        },
                        end: {
                            line: 1,
                            column: 15
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "e",
                    loc: {
                        start: {
                            line: 1,
                            column: 25
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "Identifier",
                                name: "say",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 30
                                    },
                                    end: {
                                        line: 1,
                                        column: 33
                                    }
                                }
                            },
                            arguments: [{
                                type: "Identifier",
                                name: "e",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 34
                                    },
                                    end: {
                                        line: 1,
                                        column: 35
                                    }
                                }
                            }],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 36
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 30
                            },
                            end: {
                                line: 1,
                                column: 36
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 28
                        },
                        end: {
                            line: 1,
                            column: 38
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 38
                    }
                }
            },
            finalizer: null,
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 38
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 38
            }
        }
    });

    test("try { doThat(); } catch (e) { say(e) } finally { cleanup(stuff) }", {
        type: "Program",
        body: [{
            type: "TryStatement",
            block: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "doThat",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 6
                                },
                                end: {
                                    line: 1,
                                    column: 12
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 6
                            },
                            end: {
                                line: 1,
                                column: 14
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 6
                        },
                        end: {
                            line: 1,
                            column: 15
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 17
                    }
                }
            },
            handler: {
                type: "CatchClause",
                param: {
                    type: "Identifier",
                    name: "e",
                    loc: {
                        start: {
                            line: 1,
                            column: 25
                        },
                        end: {
                            line: 1,
                            column: 26
                        }
                    }
                },
                guard: null,
                body: {
                    type: "BlockStatement",
                    body: [{
                        type: "ExpressionStatement",
                        expression: {
                            type: "CallExpression",
                            callee: {
                                type: "Identifier",
                                name: "say",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 30
                                    },
                                    end: {
                                        line: 1,
                                        column: 33
                                    }
                                }
                            },
                            arguments: [{
                                type: "Identifier",
                                name: "e",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 34
                                    },
                                    end: {
                                        line: 1,
                                        column: 35
                                    }
                                }
                            }],
                            loc: {
                                start: {
                                    line: 1,
                                    column: 30
                                },
                                end: {
                                    line: 1,
                                    column: 36
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 1,
                                column: 30
                            },
                            end: {
                                line: 1,
                                column: 36
                            }
                        }
                    }],
                    loc: {
                        start: {
                            line: 1,
                            column: 28
                        },
                        end: {
                            line: 1,
                            column: 38
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 38
                    }
                }
            },
            finalizer: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "cleanup",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 49
                                },
                                end: {
                                    line: 1,
                                    column: 56
                                }
                            }
                        },
                        arguments: [{
                            type: "Identifier",
                            name: "stuff",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 57
                                },
                                end: {
                                    line: 1,
                                    column: 62
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 49
                            },
                            end: {
                                line: 1,
                                column: 63
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 49
                        },
                        end: {
                            line: 1,
                            column: 63
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 47
                    },
                    end: {
                        line: 1,
                        column: 65
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 65
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 65
            }
        }
    });

    test("debugger;", {
        type: "Program",
        body: [{
            type: "DebuggerStatement",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 9
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 9
            }
        }
    });

    test("function hello() { sayHi(); }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "hello",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            params: [],
            body: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "sayHi",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 19
                                },
                                end: {
                                    line: 1,
                                    column: 24
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 19
                            },
                            end: {
                                line: 1,
                                column: 26
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 19
                        },
                        end: {
                            line: 1,
                            column: 27
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 17
                    },
                    end: {
                        line: 1,
                        column: 29
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 29
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 29
            }
        }
    });

    test("function eval() { }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "eval",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            params: [],
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 16
                    },
                    end: {
                        line: 1,
                        column: 19
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 19
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 19
            }
        }
    });

    test("function arguments() { }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "arguments",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 18
                    }
                }
            },
            params: [],
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 21
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 24
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 24
            }
        }
    });

    test("function test(t, t) { }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "test",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            params: [{
                    type: "Identifier",
                    name: "t",
                    loc: {
                        start: {
                            line: 1,
                            column: 14
                        },
                        end: {
                            line: 1,
                            column: 15
                        }
                    }
                },
                {
                    type: "Identifier",
                    name: "t",
                    loc: {
                        start: {
                            line: 1,
                            column: 17
                        },
                        end: {
                            line: 1,
                            column: 18
                        }
                    }
                }
            ],
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 20
                    },
                    end: {
                        line: 1,
                        column: 23
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 23
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 23
            }
        }
    });

    test("(function test(t, t) { })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: {
                    type: "Identifier",
                    name: "test",
                    loc: {
                        start: {
                            line: 1,
                            column: 10
                        },
                        end: {
                            line: 1,
                            column: 14
                        }
                    }
                },
                params: [{
                        type: "Identifier",
                        name: "t",
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 16
                            }
                        }
                    },
                    {
                        type: "Identifier",
                        name: "t",
                        loc: {
                            start: {
                                line: 1,
                                column: 18
                            },
                            end: {
                                line: 1,
                                column: 19
                            }
                        }
                    }
                ],
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 21
                        },
                        end: {
                            line: 1,
                            column: 24
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 24
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 25
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 25
            }
        }
    });

    test("function eval() { function inner() { \"use strict\" } }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "eval",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            params: [],
            body: {
                type: "BlockStatement",
                body: [{
                    type: "FunctionDeclaration",
                    id: {
                        type: "Identifier",
                        name: "inner",
                        loc: {
                            start: {
                                line: 1,
                                column: 27
                            },
                            end: {
                                line: 1,
                                column: 32
                            }
                        }
                    },
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [{
                            type: "ExpressionStatement",
                            expression: {
                                type: "Literal",
                                value: "use strict",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 37
                                    },
                                    end: {
                                        line: 1,
                                        column: 49
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 37
                                },
                                end: {
                                    line: 1,
                                    column: 49
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 35
                            },
                            end: {
                                line: 1,
                                column: 51
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 51
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 16
                    },
                    end: {
                        line: 1,
                        column: 53
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 53
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 53
            }
        }
    });

    test("function hello(a) { sayHi(); }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "hello",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            params: [{
                type: "Identifier",
                name: "a",
                loc: {
                    start: {
                        line: 1,
                        column: 15
                    },
                    end: {
                        line: 1,
                        column: 16
                    }
                }
            }],
            body: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "sayHi",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 20
                                },
                                end: {
                                    line: 1,
                                    column: 25
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 20
                            },
                            end: {
                                line: 1,
                                column: 27
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 20
                        },
                        end: {
                            line: 1,
                            column: 28
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 18
                    },
                    end: {
                        line: 1,
                        column: 30
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 30
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 30
            }
        }
    });

    test("function hello(a, b) { sayHi(); }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "hello",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            params: [{
                    type: "Identifier",
                    name: "a",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 16
                        }
                    }
                },
                {
                    type: "Identifier",
                    name: "b",
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 19
                        }
                    }
                }
            ],
            body: {
                type: "BlockStatement",
                body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "sayHi",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 23
                                },
                                end: {
                                    line: 1,
                                    column: 28
                                }
                            }
                        },
                        arguments: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 23
                            },
                            end: {
                                line: 1,
                                column: 30
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 23
                        },
                        end: {
                            line: 1,
                            column: 31
                        }
                    }
                }],
                loc: {
                    start: {
                        line: 1,
                        column: 21
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 33
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 33
            }
        }
    });

    test("function hello(...rest) { }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "hello",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            params: [{
                type: "RestElement",
                argument: {
                    type: "Identifier",
                    name: "rest",
                    loc: {
                        start: {
                            line: 1,
                            column: 18
                        },
                        end: {
                            line: 1,
                            column: 22
                        }
                    }
                }
            }],
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 24
                    },
                    end: {
                        line: 1,
                        column: 27
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 27
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 27
            }
        }
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("function hello(a, ...rest) { }", {
        type: "Program",
        body: [{
            type: "FunctionDeclaration",
            id: {
                type: "Identifier",
                name: "hello",
                loc: {
                    start: {
                        line: 1,
                        column: 9
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                }
            },
            params: [{
                    type: "Identifier",
                    name: "a",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 16
                        }
                    }
                },
                {
                    type: "RestElement",
                    argument: {
                        type: "Identifier",
                        name: "rest",
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 25
                            }
                        }
                    }
                }
            ],
            body: {
                type: "BlockStatement",
                body: [],
                loc: {
                    start: {
                        line: 1,
                        column: 27
                    },
                    end: {
                        line: 1,
                        column: 30
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 30
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 30
            }
        }
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("var hi = function() { sayHi() };", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "hi",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    }
                },
                init: {
                    type: "FunctionExpression",
                    id: null,
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [{
                            type: "ExpressionStatement",
                            expression: {
                                type: "CallExpression",
                                callee: {
                                    type: "Identifier",
                                    name: "sayHi",
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 22
                                        },
                                        end: {
                                            line: 1,
                                            column: 27
                                        }
                                    }
                                },
                                arguments: [],
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 22
                                    },
                                    end: {
                                        line: 1,
                                        column: 29
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 22
                                },
                                end: {
                                    line: 1,
                                    column: 29
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 20
                            },
                            end: {
                                line: 1,
                                column: 31
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 31
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 31
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 32
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 32
            }
        }
    });

    test("var hi = function (...r) { sayHi() };", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "hi",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    }
                },
                init: {
                    type: "FunctionExpression",
                    id: null,
                    params: [{
                        type: "RestElement",
                        argument: {
                            type: "Identifier",
                            name: "r",
                            loc: {
                                start: {
                                    line: 1,
                                    column: 22
                                },
                                end: {
                                    line: 1,
                                    column: 23
                                }
                            }
                        }
                    }],
                    body: {
                        type: "BlockStatement",
                        body: [{
                            type: "ExpressionStatement",
                            expression: {
                                type: "CallExpression",
                                callee: {
                                    type: "Identifier",
                                    name: "sayHi",
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 27
                                        },
                                        end: {
                                            line: 1,
                                            column: 32
                                        }
                                    }
                                },
                                arguments: [],
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 27
                                    },
                                    end: {
                                        line: 1,
                                        column: 34
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 27
                                },
                                end: {
                                    line: 1,
                                    column: 34
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 25
                            },
                            end: {
                                line: 1,
                                column: 36
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 36
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 36
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 37
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 37
            }
        }
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("var hi = function eval() { };", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "hi",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    }
                },
                init: {
                    type: "FunctionExpression",
                    id: {
                        type: "Identifier",
                        name: "eval",
                        loc: {
                            start: {
                                line: 1,
                                column: 18
                            },
                            end: {
                                line: 1,
                                column: 22
                            }
                        }
                    },
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 25
                            },
                            end: {
                                line: 1,
                                column: 28
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 28
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 28
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 29
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 29
            }
        }
    });

    test("var hi = function arguments() { };", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "hi",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 6
                        }
                    }
                },
                init: {
                    type: "FunctionExpression",
                    id: {
                        type: "Identifier",
                        name: "arguments",
                        loc: {
                            start: {
                                line: 1,
                                column: 18
                            },
                            end: {
                                line: 1,
                                column: 27
                            }
                        }
                    },
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [],
                        loc: {
                            start: {
                                line: 1,
                                column: 30
                            },
                            end: {
                                line: 1,
                                column: 33
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 33
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 33
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 34
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 34
            }
        }
    });

    test("var hello = function hi() { sayHi() };", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "hello",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 9
                        }
                    }
                },
                init: {
                    type: "FunctionExpression",
                    id: {
                        type: "Identifier",
                        name: "hi",
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    },
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: [{
                            type: "ExpressionStatement",
                            expression: {
                                type: "CallExpression",
                                callee: {
                                    type: "Identifier",
                                    name: "sayHi",
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 28
                                        },
                                        end: {
                                            line: 1,
                                            column: 33
                                        }
                                    }
                                },
                                arguments: [],
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 28
                                    },
                                    end: {
                                        line: 1,
                                        column: 35
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 28
                                },
                                end: {
                                    line: 1,
                                    column: 35
                                }
                            }
                        }],
                        loc: {
                            start: {
                                line: 1,
                                column: 26
                            },
                            end: {
                                line: 1,
                                column: 37
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 12
                        },
                        end: {
                            line: 1,
                            column: 37
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 37
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 38
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 38
            }
        }
    });

    test("(function(){})", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 1,
                        column: 13
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 14
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 14
            }
        }
    });

    test("{ x\n++y }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 2
                            },
                            end: {
                                line: 1,
                                column: 3
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 3
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "UpdateExpression",
                        operator: "++",
                        prefix: true,
                        argument: {
                            type: "Identifier",
                            name: "y",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 2
                                },
                                end: {
                                    line: 2,
                                    column: 3
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 3
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 0
                        },
                        end: {
                            line: 2,
                            column: 3
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 5
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 5
            }
        }
    });

    test("{ x\n--y }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "x",
                        loc: {
                            start: {
                                line: 1,
                                column: 2
                            },
                            end: {
                                line: 1,
                                column: 3
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 3
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "UpdateExpression",
                        operator: "--",
                        prefix: true,
                        argument: {
                            type: "Identifier",
                            name: "y",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 2
                                },
                                end: {
                                    line: 2,
                                    column: 3
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 3
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 0
                        },
                        end: {
                            line: 2,
                            column: 3
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 5
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 5
            }
        }
    });

    test("var x /* comment */;", {
        type: "Program",
        body: [{
            type: "VariableDeclaration",
            declarations: [{
                type: "VariableDeclarator",
                id: {
                    type: "Identifier",
                    name: "x",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        }
                    }
                },
                init: null,
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                }
            }],
            kind: "var",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 20
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 20
            }
        }
    });

    test("{ var x = 14, y = 3\nz; }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "VariableDeclaration",
                    declarations: [{
                            type: "VariableDeclarator",
                            id: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 6
                                    },
                                    end: {
                                        line: 1,
                                        column: 7
                                    }
                                }
                            },
                            init: {
                                type: "Literal",
                                value: 14,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 10
                                    },
                                    end: {
                                        line: 1,
                                        column: 12
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 6
                                },
                                end: {
                                    line: 1,
                                    column: 12
                                }
                            }
                        },
                        {
                            type: "VariableDeclarator",
                            id: {
                                type: "Identifier",
                                name: "y",
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 14
                                    },
                                    end: {
                                        line: 1,
                                        column: 15
                                    }
                                }
                            },
                            init: {
                                type: "Literal",
                                value: 3,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 18
                                    },
                                    end: {
                                        line: 1,
                                        column: 19
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 1,
                                    column: 14
                                },
                                end: {
                                    line: 1,
                                    column: 19
                                }
                            }
                        }
                    ],
                    kind: "var",
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 19
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "z",
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 1
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 0
                        },
                        end: {
                            line: 2,
                            column: 2
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 4
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 4
            }
        }
    });

    test("while (true) { continue\nthere; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "ContinueStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 5
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 6
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 8
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("while (true) { continue // Comment\nthere; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "ContinueStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 5
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 6
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 8
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("while (true) { continue /* Multiline\nComment */there; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "ContinueStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 23
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 10
                                },
                                end: {
                                    line: 2,
                                    column: 15
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 10
                            },
                            end: {
                                line: 2,
                                column: 16
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 18
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 18
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 18
            }
        }
    });

    test("while (true) { break\nthere; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "BreakStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 5
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 6
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 8
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("while (true) { break // Comment\nthere; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "BreakStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 5
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 6
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 8
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("while (true) { break /* Multiline\nComment */there; }", {
        type: "Program",
        body: [{
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                loc: {
                    start: {
                        line: 1,
                        column: 7
                    },
                    end: {
                        line: 1,
                        column: 11
                    }
                }
            },
            body: {
                type: "BlockStatement",
                body: [{
                        type: "BreakStatement",
                        label: null,
                        loc: {
                            start: {
                                line: 1,
                                column: 15
                            },
                            end: {
                                line: 1,
                                column: 20
                            }
                        }
                    },
                    {
                        type: "ExpressionStatement",
                        expression: {
                            type: "Identifier",
                            name: "there",
                            loc: {
                                start: {
                                    line: 2,
                                    column: 10
                                },
                                end: {
                                    line: 2,
                                    column: 15
                                }
                            }
                        },
                        loc: {
                            start: {
                                line: 2,
                                column: 10
                            },
                            end: {
                                line: 2,
                                column: 16
                            }
                        }
                    }
                ],
                loc: {
                    start: {
                        line: 1,
                        column: 13
                    },
                    end: {
                        line: 2,
                        column: 18
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 18
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 18
            }
        }
    });

    test("(function(){ return\nx; })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                            type: "ReturnStatement",
                            argument: null,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 13
                                },
                                end: {
                                    line: 1,
                                    column: 19
                                }
                            }
                        },
                        {
                            type: "ExpressionStatement",
                            expression: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 0
                                    },
                                    end: {
                                        line: 2,
                                        column: 1
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 2
                                }
                            }
                        }
                    ],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 2,
                            column: 4
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 2,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 5
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 5
            }
        }
    });

    test("(function(){ return // Comment\nx; })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                            type: "ReturnStatement",
                            argument: null,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 13
                                },
                                end: {
                                    line: 1,
                                    column: 19
                                }
                            }
                        },
                        {
                            type: "ExpressionStatement",
                            expression: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 0
                                    },
                                    end: {
                                        line: 2,
                                        column: 1
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 2,
                                    column: 0
                                },
                                end: {
                                    line: 2,
                                    column: 2
                                }
                            }
                        }
                    ],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 2,
                            column: 4
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 2,
                        column: 4
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 5
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 5
            }
        }
    });

    test("(function(){ return/* Multiline\nComment */x; })", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "FunctionExpression",
                id: null,
                params: [],
                body: {
                    type: "BlockStatement",
                    body: [{
                            type: "ReturnStatement",
                            argument: null,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 13
                                },
                                end: {
                                    line: 1,
                                    column: 19
                                }
                            }
                        },
                        {
                            type: "ExpressionStatement",
                            expression: {
                                type: "Identifier",
                                name: "x",
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 10
                                    },
                                    end: {
                                        line: 2,
                                        column: 11
                                    }
                                }
                            },
                            loc: {
                                start: {
                                    line: 2,
                                    column: 10
                                },
                                end: {
                                    line: 2,
                                    column: 12
                                }
                            }
                        }
                    ],
                    loc: {
                        start: {
                            line: 1,
                            column: 11
                        },
                        end: {
                            line: 2,
                            column: 14
                        }
                    }
                },
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 2,
                        column: 14
                    }
                }
            },
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 15
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 15
            }
        }
    });

    test("{ throw error\nerror; }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ThrowStatement",
                    argument: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 5
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 0
                        },
                        end: {
                            line: 2,
                            column: 6
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("{ throw error// Comment\nerror; }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ThrowStatement",
                    argument: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 2,
                                column: 0
                            },
                            end: {
                                line: 2,
                                column: 5
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 0
                        },
                        end: {
                            line: 2,
                            column: 6
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 8
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 8
            }
        }
    });

    test("{ throw error/* Multiline\nComment */error; }", {
        type: "Program",
        body: [{
            type: "BlockStatement",
            body: [{
                    type: "ThrowStatement",
                    argument: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 1,
                                column: 8
                            },
                            end: {
                                line: 1,
                                column: 13
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 1,
                            column: 2
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    }
                },
                {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Identifier",
                        name: "error",
                        loc: {
                            start: {
                                line: 2,
                                column: 10
                            },
                            end: {
                                line: 2,
                                column: 15
                            }
                        }
                    },
                    loc: {
                        start: {
                            line: 2,
                            column: 10
                        },
                        end: {
                            line: 2,
                            column: 16
                        }
                    }
                }
            ],
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 2,
                    column: 18
                }
            }
        }],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 2,
                column: 18
            }
        }
    });

    test("", {
        type: "Program",
        body: [],
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 0
            }
        }
    });

    test("foo: if (true) break foo;", {
        type: "Program",
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 25
            }
        },
        body: [{
            type: "LabeledStatement",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 25
                }
            },
            body: {
                type: "IfStatement",
                loc: {
                    start: {
                        line: 1,
                        column: 5
                    },
                    end: {
                        line: 1,
                        column: 25
                    }
                },
                test: {
                    type: "Literal",
                    loc: {
                        start: {
                            line: 1,
                            column: 9
                        },
                        end: {
                            line: 1,
                            column: 13
                        }
                    },
                    value: true
                },
                consequent: {
                    type: "BreakStatement",
                    loc: {
                        start: {
                            line: 1,
                            column: 15
                        },
                        end: {
                            line: 1,
                            column: 25
                        }
                    },
                    label: {
                        type: "Identifier",
                        loc: {
                            start: {
                                line: 1,
                                column: 21
                            },
                            end: {
                                line: 1,
                                column: 24
                            }
                        },
                        name: "foo"
                    }
                },
                alternate: null
            },
            label: {
                type: "Identifier",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 3
                    }
                },
                name: "foo"
            }
        }]
    });

    test("(function () {\n 'use strict';\n '\0';\n}())", {
        type: "Program",
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 4,
                column: 4
            }
        },
        body: [{
            type: "ExpressionStatement",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 4,
                    column: 4
                }
            },
            expression: {
                type: "CallExpression",
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    },
                    end: {
                        line: 4,
                        column: 3
                    }
                },
                callee: {
                    type: "FunctionExpression",
                    loc: {
                        start: {
                            line: 1,
                            column: 1
                        },
                        end: {
                            line: 4,
                            column: 1
                        }
                    },
                    id: null,
                    params: [],
                    body: {
                        type: "BlockStatement",
                        loc: {
                            start: {
                                line: 1,
                                column: 13
                            },
                            end: {
                                line: 4,
                                column: 1
                            }
                        },
                        body: [{
                                type: "ExpressionStatement",
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 1
                                    },
                                    end: {
                                        line: 2,
                                        column: 14
                                    }
                                },
                                expression: {
                                    type: "Literal",
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 1
                                        },
                                        end: {
                                            line: 2,
                                            column: 13
                                        }
                                    },
                                    value: "use strict"
                                }
                            },
                            {
                                type: "ExpressionStatement",
                                loc: {
                                    start: {
                                        line: 3,
                                        column: 1
                                    },
                                    end: {
                                        line: 3,
                                        column: 5
                                    }
                                },
                                expression: {
                                    type: "Literal",
                                    loc: {
                                        start: {
                                            line: 3,
                                            column: 1
                                        },
                                        end: {
                                            line: 3,
                                            column: 4
                                        }
                                    },
                                    value: "\u0000"
                                }
                            }
                        ]
                    }
                },
                arguments: [],
            }
        }]
    });

    test("123..toString(10)", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "CallExpression",
                callee: {
                    type: "MemberExpression",
                    object: {
                        type: "Literal",
                        value: 123
                    },
                    property: {
                        type: "Identifier",
                        name: "toString"
                    },
                    computed: false,
                },
                arguments: [{
                    type: "Literal",
                    value: 10
                }],
            }
        }]
    });

    test("123.+2", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "BinaryExpression",
                left: {
                    type: "Literal",
                    value: 123
                },
                operator: "+",
                right: {
                    type: "Literal",
                    value: 2
                },
            }
        }]
    });

    test("a\u2028b", {
        type: "Program",
        body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "Identifier",
                    name: "a"
                }
            },
            {
                type: "ExpressionStatement",
                expression: {
                    type: "Identifier",
                    name: "b"
                }
            }
        ]
    });

    test("'a\\u0026b'", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "Literal",
                value: "a\u0026b"
            }
        }]
    });

    test("foo: 10; foo: 20;", {
        type: "Program",
        body: [{
                type: "LabeledStatement",
                body: {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Literal",
                        value: 10,
                        raw: "10"
                    }
                },
                label: {
                    type: "Identifier",
                    name: "foo"
                }
            },
            {
                type: "LabeledStatement",
                body: {
                    type: "ExpressionStatement",
                    expression: {
                        type: "Literal",
                        value: 20,
                        raw: "20"
                    }
                },
                label: {
                    type: "Identifier",
                    name: "foo"
                }
            }
        ]
    });

    test("if(1)/  foo/", {
        type: "Program",
        body: [{
            type: "IfStatement",
            test: {
                type: "Literal",
                value: 1,
                raw: "1"
            },
            consequent: {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    raw: "/  foo/"
                }
            },
            alternate: null
        }]
    });

    test("price_9̶9̶_89", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "Identifier",
                name: "price_9̶9̶_89",
            }
        }]
    });

    // option tests

    test("var a = 1;", {
        type: "Program",
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 10
            },
            source: "test.js"
        },
        body: [{
            type: "VariableDeclaration",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 10
                },
                source: "test.js"
            },
            declarations: [{
                type: "VariableDeclarator",
                loc: {
                    start: {
                        line: 1,
                        column: 4
                    },
                    end: {
                        line: 1,
                        column: 9
                    },
                    source: "test.js"
                },
                id: {
                    type: "Identifier",
                    loc: {
                        start: {
                            line: 1,
                            column: 4
                        },
                        end: {
                            line: 1,
                            column: 5
                        },
                        source: "test.js"
                    },
                    name: "a"
                },
                init: {
                    type: "Literal",
                    loc: {
                        start: {
                            line: 1,
                            column: 8
                        },
                        end: {
                            line: 1,
                            column: 9
                        },
                        source: "test.js"
                    },
                    value: 1,
                    raw: "1"
                }
            }],
            kind: "var"
        }]
    }, {
        locations: true,
        sourceFile: "test.js"
    });

    test("a.in / b", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "BinaryExpression",
                left: {
                    type: "MemberExpression",
                    object: {
                        type: "Identifier",
                        name: "a"
                    },
                    property: {
                        type: "Identifier",
                        name: "in"
                    },
                    computed: false
                },
                operator: "/",
                right: {
                    type: "Identifier",
                    name: "b"
                }
            }
        }]
    });

    // A number of slash-disambiguation corner cases
    test("return {} / 2", {}, {
        allowReturnOutsideFunction: true
    });
    test("return\n{}\n/foo/", {}, {
        allowReturnOutsideFunction: true
    });
    test("+{} / 2", {});
    test("{}\n/foo/", {});
    test("x++\n{}\n/foo/", {});
    test("{{}\n/foo/}", {});
    test("while (1) /foo/", {});
    test("(1) / 2", {});
    test("({a: [1]}+[]) / 2", {});
    test("{[1]}\n/foo/", {});
    test("switch(a) { case 1: {}\n/foo/ }", {});
    test("({1: {} / 2})", {});
    test("+x++ / 2", {});
    test("foo.in\n{}\n/foo/", {});

    test("{}/=/", {
        type: "Program",
        body: [{
                type: "BlockStatement",
                body: []
            },
            {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    raw: "/=/"
                }
            }
        ]
    });

    test("foo <!--bar\n+baz", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "BinaryExpression",
                left: {
                    type: "Identifier",
                    name: "foo"
                },
                operator: "+",
                right: {
                    type: "Identifier",
                    name: "baz"
                }
            }
        }]
    });

    test("x = y-->10;\n --> nothing", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "Identifier",
                    name: "x"
                },
                right: {
                    type: "BinaryExpression",
                    left: {
                        type: "UpdateExpression",
                        operator: "--",
                        prefix: false,
                        argument: {
                            type: "Identifier",
                            name: "y"
                        }
                    },
                    operator: ">",
                    right: {
                        type: "Literal",
                        value: 10
                    }
                }
            }
        }]
    });

})