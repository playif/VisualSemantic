/**
 * Created by Tim on 2014/6/18.
 */

angular.module('editor.directives', ['d3'])
    .directive('d3Bars', ['d3', function (d3) {
        return {
            restrict: 'E',
            scope: {
                root: '=',
                label: '@',
                onClick: '&',
                myField: '='
            },
            link: function (scope, ele, attrs) {




//                var data = [
//                    {name: "p1", children: [
//                        {name: "c1"},
//                        {name: "c2"},
//                        {name: "c3"},
//                        {name: "c4"},
//                        {name: "c3"},
//                        {name: "c4"}
//                    ]}
//                ];


//                var width = 400, height = 200, radius = 10, gap = 50;
//
//                // test layout
//                var nodes = [];
//                var links = [];
//                data.forEach(function (d, i) {
//                    d.x = width / 4;
//                    d.y = height / 2;
//                    nodes.push(d);
//                    d.children.forEach(function (c, i) {
//                        c.x = 3 * width / 4;
//                        c.y = gap * (i + 1) - 2 * radius;
//                        nodes.push(c);
//                        links.push({source: d, target: c});
//                    })
//                });
//
//                var color = d3.scale.category20();
//                var svg = d3.select(ele[0]).append("svg")
//                    .attr("width", width)
//                    .attr("height", height)
//                    .append("g");
//
//                scope.render = function (data) {
//                    svg.selectAll('*').remove();
//
//
//                    var diagonal = d3.svg.diagonal()
//                        .source(function (d) {
//                            return {"x": d.source.y, "y": d.source.x};
//                        })
//                        .target(function (d) {
//                            return {"x": d.target.y, "y": d.target.x};
//                        })
//                        .projection(function (d) {
//                            return [d.y, d.x];
//                        });
//
//                    var link = svg.selectAll(".link")
//                        .data(links)
//                        .enter().append("path")
//                        .attr("class", "link")
//                        .attr("d", diagonal);
//
//                    var circle = svg.selectAll(".circle")
//                        .data(nodes)
//                        .enter()
//                        .append("g")
//                        .attr("class", "circle");
//
//                    var el = circle.append("circle")
//                        .attr("cx", function (d) {
//                            return d.x
//                        })
//                        .attr("cy", function (d) {
//                            return d.y
//                        })
//                        .attr("r", radius)
//                        .style("fill", function (d) {
//                            return color(d.name)
//                        })
//                        .append("title").text(function (d) {
//                            return d.name
//                        });
//                };
//
                var m = [20, 120, 20, 120],
                    w = 600 - m[1] - m[3],
                    h = 400 - m[0] - m[2],
                    i = 0,
                    root;

                var tree = d3.layout.tree()
                    .size([h, w]);

                var diagonal = d3.svg.diagonal()
                    .source(function (d) {
                        return {"x": d.source.x - 5, "y": d.source.y};
                    })
                    .target(function (d) {
                        //kango.console.log(d);
                        return {"x": d.target.x - 5, "y": d.target.y - 50 };
                    })
                    .projection(function (d) {
                        return [d.y, d.x];
                    });

                var vis = d3.select(ele[0]).append("svg")
                    .attr("width", "100%")
                    .attr("height", h + m[0] + m[2])
                    .append("svg:g")
                    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

                $(window).resize(function (e) {
                    //kango.console.log("resize");
                    update();
                });

//                d3.json("flare.json", function (json) {
//
//                });


                scope.currentDepth = 0;
                var source = {};
                var prevSelectNode;

                function toggleAll(d) {
                    if (d.children) {
                        d.children.forEach(toggleAll);
                        toggle(d);
                    }
                }

                function openAll(d) {
                    if (d.children) {
                        d.children.forEach(openAll);
                        open(d);
                    }
                }

                function closeAll(d) {
                    if (d.children) {
                        d.children.forEach(closeAll);
                        close(d);
                    }
                }

                function selectNode(d) {
                    d.isSelected = true;
                    prevSelectNode = d;
                }

                function unselectNode(d) {
                    d.isSelected = false;
                }

                function unselectPrev() {
                    if (prevSelectNode) {
                        unselectNode(prevSelectNode);
                    }
                }

//                function unselectAll(d) {
//                    unselectNode(d);
//                    if (d.children) {
//                        d.children.forEach(unselectAll);
//                    }
//                    if (d._children) {
//                        d._children.forEach(unselectAll);
//                    }
//                }

                // Initialize the display to show a few nodes.
                //root.children.forEach(toggleAll);

//                toggle(root.children[1]);
//                toggle(root.children[1].children[2]);
//                toggle(root.children[9]);
//                toggle(root.children[9].children[0]);

                function setCurrentNode(d) {
                    scope.currentDepth = d.depth;
                    unselectPrev();
                    selectNode(d);

                    closeAll(d);
                    showOnlyMe(d);
                    showMyChildren(d);
                    update();

                    scope.$parent.parent.setHighlight({path: prevSelectNode.select});
                }

                function update(cssPath) {
                    var duration = d3.event && d3.event.altKey ? 5000 : 500;

                    var width = $(ele[0]).width();
                    var maxDepth = Math.floor(width / 120) - 1;

                    // Compute the new tree layout.
                    var nodes = tree.nodes(source).reverse();
                    if (cssPath) {
                        var curNode = _.last(nodes);
                        //kango.console.log(curNode);
                        //closeAll(curNode);
                        var tokens = cssPath.split('>');
                        //kango.console.log("start: " );
                        //kango.console.log(curNode);
                        if (tokens.length === 1) {

                            //openAll(curNode);
                            setCurrentNode(curNode);
                            return;
                        }
                        else {
                            for (var t in tokens) {
                                var token = tokens[t];

                                if (token === _.first(tokens)) {
                                    continue;
                                }
                                //kango.console.log("token: " + token);

                                if (curNode._children) {
                                    var d = _.find(curNode._children, function (o) {
                                        return o.name === token;
                                    });
                                    if (!d) {
                                        scope.$parent.msg = "無法找到目標節點，請確定該頁面是否為目標頁面，或重新擷取!";
                                        return;
                                    }
                                    curNode = d;

                                    if (token === _.last(tokens)) {
                                        //kango.console.log(d);
                                        setCurrentNode(d);
                                        return;
                                    }
                                }
                            }
                        }

                    }

                    // Normalize for fixed-depth.
                    nodes.forEach(function (d) {
                        d.y = (d.depth - Math.max(0, scope.currentDepth - maxDepth + 1)) * 120 - 50;
                    });

                    nodes = nodes.filter(function (d, i) {

                        return d.depth > scope.currentDepth - maxDepth;
                    });

                    // Update the nodes…
                    var node = vis.selectAll("g.node")
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node
                        .enter()
                        .append("svg:g")

                        .attr("class", "node")
                        .attr("transform", function (d) {
                            //kango.console.log(d);
                            var p = d.parent ? d.parent : source;
                            return "translate(" + (p.y0 || p.y) + "," + (p.x0 || p.x) + ")";
                        });

                    var rect = nodeEnter.append("svg:rect")

                        //               .attr("r", 0)
                        .attr("x", 0)         // position the left of the rectangle
                        .attr("y", 0)          // position the top of the rectangle
                        .attr("height", 0)    // set the height
                        .attr("width", 0)     // set the width
                        .attr("rx", 10)         // set the x corner curve radius
                        .attr("ry", 10)        // set the y corner curve radius
                        // .attr("ry", 0)
                        .style("fill", function (d) {
                            return d._children ? "lightsteelblue" : "#fff";
                        }).on("click", function (d) {
                            setCurrentNode(d);

                            scope.$apply(function () {
                                scope.myField.path = d.select;
                                //console.log(d.select);
                            });

                        }).on("mouseover", function (d) {

                            scope.$parent.parent.unsetHighlight({path: prevSelectNode.select});
                            scope.$parent.parent.setHighlight({path: d.select});
                            d3.select(this).style("stroke", function (d) {
                                return d._children ? "red" : "red";
                            });
                            //kango.console.log(d);
                        }).on("mouseout", function (d) {
                            scope.$parent.parent.unsetHighlight({path: d.select});
                            scope.$parent.parent.setHighlight({path: prevSelectNode.select});
                            d3.select(this).style("stroke", function (d) {
                                return d._children ? "steelblue" : "steelblue";
                            });
                        });

                    rect.append("svg:title")
                        .text(function (d, i) {
                            return "節點個數： " + (d.num || 1)
                                + "\n深度： " + d.deep
                                + "\n最大深度： " + d.maxDeep;
                        });

                    nodeEnter.append("svg:circle")
                        .attr("cx", function (d) {
                            return 0;
                        })         // position the left of the rectangle
                        .attr("cy", -4)
                        .style("opacity", 1e-6);

                    nodeEnter.append("svg:text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("text-anchor", 'middle')
                        .text(function (d) {
                            return d.name.substring(0, Math.min(d.name.length, 8));
                        })
                        .style("fill-opacity", 1e-6)
                        .style("font-size", "1px");


//                    nodeEnter = d3.selectAll("g")
//                        .each(function (d) {
//                            if (d)
//                                console.log("here" + d.path);
//                        });

//                    nodeEnter
//                        .append("svg:circle")
//                        .each(function (d) {
//                            if (d) {
//                                d3.select(this)
//                                    .attr("r", 20)
//                                    .style("fill", function (d) {
//                                        return d._children ? "lightsteelblue" : "#fff";
//                                    });
//                            }
//
//                        });


//                    nodeEnter.append("svg:text")
//                        .attr("x", function (d) {
//                            return d.children || d._children ? -10 : 10;
//                        })
//                        .attr("dy", ".35em")
//                        .attr("text-anchor", function (d) {
//                            return d.children || d._children ? "end" : "start";
//                        })
//                        .text(function (d) {
//                            return d.name;
//                        })
//                        .style("fill-opacity", 1e-6);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });

                    nodeUpdate.select("rect")
                        //              .attr("r", 60)
                        .attr("x", -50)         // position the left of the rectangle
                        .attr("y", -17)          // position the top of the rectangle
                        .attr("height", 25)    // set the height
                        .attr("width", 100)     // set the width
                        .attr("rx", 10)         // set the x corner curve radius
                        .attr("ry", 10)        // set the y corner curve radius
                        // .attr("ry", 20)
                        .style("fill", function (d) {
                            return d._children && d._children.length ? "lightsteelblue" : "#fff";
                        })
                        .filter(function (d) {
                            return d.isSelected;
                        })
                        .style("fill", function (d) {
                            return d._children ? "pink" : "pink";
                        });

                    nodeUpdate.select("circle")
                        .attr("cx", function (d) {
                            return -50;
                        })
                        .attr("r", 0)
                        .style("opacity", 1)
                        .filter(function (d) {
                            if (!d.children) return true;
                            return false;
                        })
                        .attr("r", 4);


                    nodeUpdate.select("text")
                        .style("fill-opacity", 1)
                        .style("font-size", "14px");

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            var p = d.parent ? d.parent : source;
                            return "translate(" + p.y + "," + p.x + ")";
                        })
                        .remove();

                    nodeExit.select("rect")
                        .attr("width", 0)
                        .attr("height", 0)
                        .attr("x", 0)         // position the left of the rectangle
                        .attr("y", 0);
                    // .attr("ry", 0);

                    nodeExit.select("circle")
                        .attr("cx", function (d) {
                            return 0;
                        })
                        .style("opacity", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6)
                        .style("font-size", "1px");

                    var linkData = tree.links(nodes);
//                        .filter(function (d) {
//                            return d.target.path;
//                        });


                    // Update the links…
                    var link = vis.selectAll("path.link")
                        .data(linkData, function (d) {
                            //console.log(d);
                            return d.target.id;
                        });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("svg:path", "g")

                        .attr("class", "link")
                        .attr("d", function (d) {
                            //var p = d.parent ? d.parent : source;
                            var t = {x: d.source.x0 || d.source.x, y: (d.source.y0 || d.source.y) + 50};
                            var s = {x: d.source.x0 || d.source.x, y: d.source.y0 || d.source.y};

                            return diagonal({source: s, target: t});
                        })
                        .attr("stroke-width", "1.5px")
                        .attr("stroke", "pink")
                        .transition()
                        .duration(duration)
                        .attr("d", diagonal)
                        .attr("stroke-width", "5px");

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal)
                        .attr("stroke-width", "5px")
                        .attr("stroke", "pink")
                        .filter(function (d) {
                            if (d.target.children || d.target.isSelected) return true;
                            return false;
                        })
                        .attr("stroke", "#ccc");

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function (d) {
                            //var p = d.parent ? d.parent : source;
                            var t = {x: d.source.x, y: d.source.y + 50};
                            var s = {x: d.source.x, y: d.source.y};

                            return diagonal({source: s, target: t});
                        })
                        .style("stroke-opacity", 1e-6)
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });


                }

                //scope.update(scope.root);

//                $window.onresize = function () {
//                    scope.$apply();
//                };

//                scope.$watch(function () {
//                    return angular.element($window)[0].innerWidth;
//                }, function () {
//                    scope.update(scope.data);
//                });

                scope.$watch('root', function (newData) {
                    //console.log(newData);
                    //console.log(newData);
                    if (!newData) return;
                    scope.currentDepth = 0;
                    //closeAll(newData);
                    source = angular.copy(newData);
                    source.x0 = h / 2;
                    source.y0 = 0;
                    tree.nodes(source);
                    closeAll(source);
                    //console.log(scope.myField);
//                    if (scope.myField) {
//                        openAll(source);
//                        update(scope.myField.path);
//                    }
//                    else {
//                        closeAll(source);
//                        update();
//                    }

                    //setCurrentNode(scope.myPath);
                });

                scope.$watch('myField', function (newData) {
                    //kango.console.log(scope.myPath);
                    //console.log("myField: ");
                    //console.log(newData);
                    if (!newData) return;
                    //setCurrentNode(newData);

                    update(newData.path);
                });

//                function setCurrentNode(path) {
//                    var curNode = source;
//                    //closeAll(source);
//                    var tokens = path.split('>');
//                    kango.console.log("start: " + source);
//                    for (var t in tokens) {
//
//                        var token = tokens[t];
//
//                        if (token === _.first(tokens)) {
//                            continue;
//                        }
//
//                        kango.console.log("token: " + token);
//
//                        if (curNode._children) {
//                            var d = _.find(curNode._children, function (o) {
//                                return o.name === token;
//                            });
//                            curNode = d;
//
//
//                            if (token === _.last(tokens)) {
//
//                                kango.console.log(d);
//                                unselectAll(source);
//                                selectNode(d);
//
//                                closeAll(d);
//                                showOnlyMe(d);
//                                showMyChildren(d);
//                                update();
//
//                            }
//
//
//                        }
//
//
//                    }
//
//
//                }

//                function setToken(tok,node){
//
//                }

//// Toggle children.
                function toggle(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                }

                function open(d) {
                    if (d.children) {
//                        d._children = d.children;
//                        d.children = null;
                    } else {
                        if (d._children) {
                            d.children = d._children;
                        }
                        //d._children = null;
                    }
                }

                function close(d) {
                    if (d.children) {
                        if (!d._children) {
                            d._children = d.children;
                        }
                        d.children = null;
                    } else {
//                        d.children = d._children;
//                        d._children = null;
                    }
                }

//                function showPath(d) {
//                    d.path = true;
//                }

//                function showAll(d) {
//                    showPath(d);
//                    if (d.children) {
//                        d.children.forEach(showAll);
//                    }
//                }

                function showOnlyMe(d) {
                    if (d.parent) {
                        var p = d.parent;
                        if (!p._children) {
                            p._children = p.children;
                        }
                        p.children = [d];
                        showOnlyMe(p);
                    }
                }

                function showMyChildren(d) {
                    if (d._children) {
                        d.children = d._children;
                    }
                }

//                function hidePath(d) {
//                    d.path = false;
//                }
//
//                function hideAll(d) {
//                    hidePath(d);
//                    if (d.children) {
//                        d.children.forEach(hideAll);
//                    }
//                }

//                function connectParent(d) {
//                    if (d.parent) {
//                        d.parent.path = true;
//                    }
//                }

                function connectAllParent(d) {
                    connectParent(d);
                    if (d.parent) {
                        connectAllParent(d.parent);
                    }
                }

//                function showAll(d) {
//                    d.all = true;
//                    d.path = false;
//                }


//
//                var renderTimeout;
//                var margin = parseInt(attrs.margin) || 20,
//                    barHeight = parseInt(attrs.barHeight) || 20,
//                    barPadding = parseInt(attrs.barPadding) || 5;
//
//                var svg = d3.select(ele[0])
//                    .append('svg')
//                    .style('width', '100%');
//
//                $window.onresize = function () {
//                    scope.$apply();
//                };
//
//                scope.$watch(function () {
//                    return angular.element($window)[0].innerWidth;
//                }, function () {
//                    scope.render(scope.data);
//                });
//
//                scope.$watch('data', function (newData) {
//                    console.log(newData);
//                    scope.render(newData);
//                }, true);
//
//                scope.onClick = function (item) {
//                    scope.$apply(function () {
//                        if (!scope.showDetailPanel)
//                            scope.showDetailPanel = true;
//                        scope.detailItem = item;
//                    });
//                    console.log("here");
//                };
//
//                scope.render = function (data) {
//                    svg.selectAll('*').remove();
//
//                    if (!data) return;
//                    if (renderTimeout) clearTimeout(renderTimeout);
//
//                    renderTimeout = $timeout(function () {
//                        var width = d3.select(ele[0])[0][0].offsetWidth - margin,
//                            height = scope.data.length * (barHeight + barPadding),
//                            color = d3.scale.category20(),
//                            xScale = d3.scale.linear()
//                                .domain([0, d3.max(data, function (d) {
//                                    return d.score;
//                                })])
//                                .range([0, width]);
//
//                        svg.attr('height', height);
//
//                        svg.selectAll('rect')
//                            .data(data)
//                            .enter()
//                            .append('rect')
//                            .on('click', function (d, i) {
//                                console.log(scope);
//                                return scope.$parent.onClick2({item: d});
//                            })
//                            .attr('height', barHeight)
//                            .attr('width', 140)
//                            .attr('x', Math.round(margin / 2))
//                            .attr('y', function (d, i) {
//                                return i * (barHeight + barPadding);
//                            })
//                            .attr('fill', function (d) {
//                                return color(d.score);
//                            })
//                            .transition()
//                            .duration(1000)
//                            .attr('width', function (d) {
//                                return xScale(d.score);
//                            });
//                        svg.selectAll('text')
//                            .data(data)
//                            .enter()
//                            .append('text')
//                            .attr('fill', '#fff')
//                            .attr('y', function (d, i) {
//                                return i * (barHeight + barPadding) + 15;
//                            })
//                            .attr('x', 15)
//                            .text(function (d) {
//                                return d.name + " (scored: " + d.score + ")";
//                            });
//                    }, 200);
//                };
            }}
    }]);