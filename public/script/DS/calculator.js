var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function Calculator(text){
	text = text.replace( /^\s+|\s+$/g, '');
	text = text.replace( /\s+/g, ' ' );
	this.text = text;
}

Calculator.prototype.splitToTokens = function(){
	this.tokens = this.text.split(' ');
};

Calculator.prototype.pushCheck = function( pushEle, lastEle ){
	if( pushEle === ')' ) return false;
	else if( Calculator.PUSH_PRIORITY[pushEle] > Calculator.POP_PRIORITY[lastEle] ) return true;
	else return false;
};

Calculator.prototype.callOperation = function(operator, a, b){
	switch(operator){
		case '+': return a+b;
		case '-': return a-b;
		case '*': return a*b;
		case '/': return a/b;
	}
}

Calculator.prototype.popCal = function(token){
	while(this.operatorStack.length > 0){
		var last = this.operatorStack.pop();
		if(token === ')'){
			if(last === '(') break;
		}
		else if(Calculator.PUSH_PRIORITY[token] > Calculator.POP_PRIORITY[last]){
			break;
		}
		var b = this.numberStack.pop(), a = this.numberStack.pop();
		this.numberStack.push(this.callOperation(last, a, b));
	}
};

Calculator.prototype.calculate = function(){
	this.splitToTokens();

	this.numberStack = [];
	this.operatorStack = [];
	for( var i = 0 ; i < this.tokens.length ; ++i ){
		if(isNumber(this.tokens[i])){
			this.numberStack.push(parseFloat(this.tokens[i]));
		}
		else{
			if( this.operatorStack.length > 0 ){
				var last = this.operatorStack[this.operatorStack.length-1];
				if( !this.pushCheck(this.tokens[i], last)){
					this.popCal(this.tokens[i]);
				}				
			}
			if(this.tokens[i] !== ')') this.operatorStack.push(this.tokens[i]);
		}
	}
	this.popCal('$');
	this.result = this.numberStack[0];
	return this.result;
}

Calculator.PUSH_PRIORITY = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
	'(': 3,
	'$': 0
};

Calculator.POP_PRIORITY = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
	'(': 0,
};