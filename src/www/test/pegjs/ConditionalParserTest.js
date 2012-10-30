var fixture = {};

module( "pegjs.ConditionalParser", {
  setup: function() {
      fixture.data = {
          'prompt1' : 'response1',
          'prompt2' : 'response2',
          'prompt3' : 'response3',
          'prompt4' : 'response4',

          'number1' : 1,
          'number2' : 2

      };
  },
  teardown: function() {
      delete fixture.data;
  }
});

test( "Test a == a, with text : true", function() {

    var condition = "prompt1 == response1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should result to true with == condition." );
});

test( "Test a == a, with numbers : true", function() {

    var condition = "number1 == 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should result to true with == condition." );
});

test( "Test a == b : false", function() {

    var condition = "prompt1 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "Unequal values should result to false with == condition." );
});

test( "Test a != b : true", function() {

    var condition = "prompt1 != response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Unequal values should result to true with != condition." );
});

test( "Test a != a : false", function() {

    var condition = "prompt1 != response1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "Equal values should result to false with != condition." );
});

test( "Test 2 > 1 : true", function() {

    var condition = "number2 > 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than 1." );
});

test( "Test 2 >= 1 : true", function() {

    var condition = "number2 >= 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than or equal to 1." );
});

test( "Test 2 < 1 : false", function() {

    var condition = "number2 < 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "2 is not less than 1." );
});

test( "Test 2 > 1 : true", function() {

    var condition = "number2 > 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than 1." );
});

test( "Test 2 >= 1 : true", function() {

    var condition = "number2 >= 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than or equal to 1." );
});

test( "Test a == a and b == b : true", function() {

    var condition = "prompt1 == response1 and prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two truthful expressions should be true." );
});

test( "Test a == b and b == b : false", function() {

    var condition = "prompt1 == response2 and prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "AND of at least one false expression should be false." );
});

test( "Test a == b and b == c : false", function() {

    var condition = "prompt1 == response2 and prompt2 == response3";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "AND of two false expressions should be false." );
});

test( "Test a == a and b == b and c == c : true", function() {

    var condition = "prompt2 == response2 and prompt2 == response2 and number1 == 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of three truthful expressions should be true." );
});

test( "Test a == a or b == b : true", function() {

    var condition = "prompt1 == response1 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two truthful expressions should be true." );
});

test( "Test a == b or b == b : true", function() {

    var condition = "prompt1 == response2 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true expression should be true." );
});

test( "Test a == b or b == c : false", function() {

    var condition = "prompt1 == response2 or prompt2 == response3";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "OR of two false expressions should be false." );
});

test( "Test a == a and b == b or c == d : true", function() {

    var condition = "prompt1 == response1 and prompt2 == response2 or prompt3 == prompt4";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "The left and should be evaluated first." );
});

test( "Test a == b and b == b or c == d : false", function() {

    var condition = "prompt1 == response2 and prompt2 == response2 or prompt3 == prompt4";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "The left and should be evaluated first." );
});

test( "Test (a == a) : true", function() {

    var condition = "(prompt1 == response1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should be matched." );
});

test( "Test (a == a) and (b == b) : true", function() {

    var condition = "(prompt1 == response1) and (prompt2 == response2)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a) and (b == b) and (c == c) : true", function() {

    var condition = "(prompt1 == response1) and (prompt2 == response2) and (number1 == 1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of three true parenthetical expressions should be true." );
});

test( "Test (a == a) or (b == b) : true", function() {

    var condition = "(prompt1 == response1) or (prompt2 == response2)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two true parenthetical expressions should be true." );
});

test( "Test (a == a) or (b == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1) or (prompt2 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of three true parenthetical expressions should be true." );
});

test( "Test (a == a and b == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and prompt2 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two true parenthetical expressions should be true." );
});

test( "Test (a == a and c == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and prompt3 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true parenthetical expressions should be true." );
});

test( "Test (a == a and b == b) or (c == a) : true", function() {

    var condition = "(prompt1 == response1 and prompt2 == response2) or (prompt3 == response1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true parenthetical expressions should be true." );
});

test( "Test (a == a or b == b) and (c == c) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response2) and (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a or b == c) and (c == c) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response3) and (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a or b == c) and (c == c or d == d) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response3) and (prompt3 == response3 or prompt4 == prompt4)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a and (b == b or c == d)) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and (prompt2 == response2 or prompt3 == prompt4)) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Nested parenthetical expressions should be allowed." );
});

test( "Test (((a == a) and ((b == b) or (c == d))) or (c == c)) : true", function() {

    var condition = "(((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3))";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Nested parenthetical expressions should be allowed." );
});

test( "Test (((a == a) and ((b == b) or (c == d))) or (c == c)) and (((a == a) and ((b == b) or (c == d))) or (c == c)) : true", function() {

    var condition = "(((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3)) and (((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3))";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Long expressions with nested parenthetical expressions should be allowed." );
});