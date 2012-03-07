{
    var data = {id_1: 'v1', id_2: 'v2', id_3 : 'v3'};

    function concat(array){
        return array.join("");
    }

    function trim(string){
        return string.replace(/^\s*([\S\s]*?)\s*$/, '$1');
    }

    function cond(leftValue, condition, rightValue){

        switch(trim(condition)){
            case '==':
                return leftValue == rightValue;
            case '!=':
                return leftValue != rightValue;
            case '>':
                return leftValue > rightValue;
            case '<':
                return leftValue < rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            default:
                return false;

        }

    }

    function conj(leftValue, conjunction, rightValue){
        switch(trim(conjunction)){
            case 'and':
                return leftValue && rightValue;
            case 'or':
                return leftValue || rightValue;

        }
    }

}


sentence = [(] sentence:sentence [)] {return sentence}
         / l:expression c:conjunction r:sentence {return conj(l, c, r);}
         / expression /

expression = id:id c:condition value:value {return cond(data[id], c, value)}

id = id:[a-zA-Z0-9_]+ {return concat(id);}

condition = ' == ' / ' != ' / ' > ' / ' < ' / ' >= ' / ' <= '

value = value:[a-zA-Z0-9_]+ {return concat(value);}

conjunction = ' and ' / ' or '

