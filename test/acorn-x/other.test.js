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

describe('acorn-x code 其他测试', () => {
    const test = (code, correctAst, options) => {
        it(`成功测试${index++}`, () => {
            const ast = acorn.parse(code, { ...options, locations: true });
            expect(ast).to.deep.have.properties(correctAst);
        }).timeout(5000);
    }


    test("'use strict';\nobject.static();", {
        type: "Program",
        body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: "use strict",
                    raw: "'use strict'"
                }
            },
            {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        object: {
                            type: "Identifier",
                            name: "object"
                        },
                        property: {
                            type: "Identifier",
                            name: "static"
                        },
                        computed: false
                    },
                    arguments: []
                }
            }
        ]
    });

    // Failure tests



    test("let++", {
        type: "Program",
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: 5
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
                    line: 1,
                    column: 5
                }
            },
            expression: {
                type: "UpdateExpression",
                loc: {
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 1,
                        column: 5
                    }
                },
                operator: "++",
                prefix: false,
                argument: {
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
                    name: "let"
                }
            }
        }]
    });

    // ECMA 6 support

    test("let x", {
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
            kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("let x, y;", {
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
            kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("let x = 42", {
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
            kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("let eval = 42, arguments = 42", {
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
            kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("let x = 14, y = 3, z = 1977", {
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
            kind: "let",
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

    test("for(let x = 0;;);", {
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
                kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("for(let x = 0, y = 1;;);", {
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
                kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("for (let x in list) process(x);", {
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
                kind: "let",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("const x = 42", {
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
                    value: 42,
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
            }],
            kind: "const",
            loc: {
                start: {
                    line: 1,
                    column: 0
                },
                end: {
                    line: 1,
                    column: 12
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
                column: 12
            }
        }
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("const eval = 42, arguments = 42", {
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
                                column: 6
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
                            column: 6
                        },
                        end: {
                            line: 1,
                            column: 15
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
                                column: 17
                            },
                            end: {
                                line: 1,
                                column: 26
                            }
                        }
                    },
                    init: {
                        type: "Literal",
                        value: 42,
                        loc: {
                            start: {
                                line: 1,
                                column: 29
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
                            column: 17
                        },
                        end: {
                            line: 1,
                            column: 31
                        }
                    }
                }
            ],
            kind: "const",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });

    test("const x = 14, y = 3, z = 1977", {
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
                },
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "z",
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
                    init: {
                        type: "Literal",
                        value: 1977,
                        loc: {
                            start: {
                                line: 1,
                                column: 25
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
                            column: 21
                        },
                        end: {
                            line: 1,
                            column: 29
                        }
                    }
                }
            ],
            kind: "const",
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
    }, {
        ecmaVersion: 6,
        locations: true
    });



    test("function f(f) { 'use strict'; }", {});

    // https://github.com/marijnh/acorn/issues/204
    test("(function () {} / 1)", {
        type: "Program",
        body: [{
            type: "ExpressionStatement",
            expression: {
                type: "BinaryExpression",
                left: {
                    type: "FunctionExpression",
                    id: null,
                    params: [],
                    body: {
                        type: "BlockStatement",
                        body: []
                    }
                },
                operator: "/",
                right: {
                    type: "Literal",
                    value: 1
                }
            }
        }]
    });

    test("function f() {} / 1 /", {
        type: "Program",
        body: [{
                type: "FunctionDeclaration",
                id: {
                    type: "Identifier",
                    name: "f"
                },
                params: [],
                body: {
                    type: "BlockStatement",
                    body: []
                }
            },
            {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    regex: {
                        pattern: " 1 ",
                        flags: ""
                    },
                    value: / 1 /
                }
            }
        ]
    });
})