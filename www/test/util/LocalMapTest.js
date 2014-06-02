module("util.LocalMap", {
    setup: function () {
        "use strict";
        fixture.localStorageBackup = {};
        var key;
        for (key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                fixture.localStorageBackup[key] = localStorage[key];
            }
        }
    },
    teardown: function () {
        "use strict";
        LocalMap('test-namespace').deleteNamespace();
        var key;
        for (key in fixture.localStorageBackup) {
            if (fixture.localStorageBackup.hasOwnProperty(key)) {
                localStorage[key] = fixture.localStorageBackup[key];
            }
        }
    }
});

test("Test LocalMap()", function () {
    "use strict";
    ///
    var map = LocalMap('test-namespace');
    ///

    ok(map !== undefined, "Should be able to construct an instance of LocalMap. Check your library paths.");
});

test("Test set()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    ///
    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");
    //

    ok(map.isSet("var-1"), "A variable should be successful set.");
    ok(map.isSet("var-2"), "A variable should be successful set.");
    ok(map.isSet("var-3"), "A variable should be successful set.");
});

test("Test get()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");

    ///
    var var1 = map.get("var-1");
    var var2 = map.get("var-2");
    var var3 = map.get("var-3");
    var var4 = map.get("var-4");
    //

    equal(var1, "val-1", "A set variable should be successfully retrieved.");
    equal(var2, "val-2", "A set variable should be successfully retrieved.");
    equal(var3, "val-3", "A set variable should be successfully retrieved.");
    equal(var4, null, "A variable that was not set should not be retrieved.");
});

test("Test getMap()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");

    ///
    var obj = map.getMap();
    //

    ok(obj["var-1"] !== undefined, "Returned object should include the set variables.");
    ok(obj["var-2"] !== undefined, "Returned object should include the set variables.");
    ok(obj["var-3"] !== undefined, "Returned object should include the set variables.");
});

test("Test length()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");

    ///
    var length = map.length();
    //

    equal(length, 3, "The function length() should return the number of set elements.");
});

test("Test release()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");

    ///
    map.release("var-1");
    //

    equal(map.length(), 2, "Length of the map should successfully update after a set variable is deleted.");
    ok(!map.isSet('var-1'), "A released variable should not be set.");
    ok(map.isSet('var-2'), "Not released variables should still be set.");
});

test("Test exists()", function () {
    "use strict";
    LocalMap('test-namespace');

    ///
    var namespaceExists = LocalMap.exists('test-namespace');
    //

    ok(namespaceExists, "Constructed map namespace should exist.");
});

test("Test deleteNamespace()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    ///
    map.deleteNamespace();
    //

    ok(!LocalMap.exists('test-namespace'), "Deleted namespace should not exist.");
});

test("Test erase()", function () {
    "use strict";
    var map = LocalMap('test-namespace');

    map.set("var-1", "val-1");
    map.set("var-2", "val-2");
    map.set("var-3", "val-3");

    ///
    map.erase();
    //

    equal(map.length(), 0, "Length of erased map should be 0.");
    ok(!map.isSet('var-1'), "Erased map should not have any set variables.");
    ok(!map.isSet('var-2'), "Erased map should not have any set variables.");
});

test("Test importMap()", function () {
    "use strict";
    var map = LocalMap('test-namespace');
    map.erase();

    var objToImport = {
        var1 : "val1",
        var2 : "val2",
        var3 : "val3"
    };

    ///
    map.importMap(objToImport);
    //

    equal(map.length(), 3, "Updated map should have the same number of elements as the imported object.");
    ok(map.isSet('var1'), "An imported variable var1 should be set.");
    ok(map.isSet('var2'), "An imported variable var2 should be set.");
});


test("Test destroy()", function () {
    "use strict";
    LocalMap('test-namespace-1');
    LocalMap('test-namespace-2');

    ///
    LocalMap.destroy();
    //

    ok(!LocalMap.exists('test-namespace-1'), "Destroyed localStorage should not have any namespaces.");
    ok(!LocalMap.exists('test-namespace-1'), "Destroyed localStorage should not have any namespaces.");

});