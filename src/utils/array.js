Array.prototype.subset =function(arr){
	var ret = [];
	for (var i = arr.length - 1; i >= 0; i--){
		ret.push(this[arr[i]]);
	} 
	return ret;
};
Array.prototype.rotate =function(reverse){
  if(reverse)
    {this.push(this.shift());}
  else
    {this.unshift(this.pop());}
  return this;
};
Array.prototype.rotateTo =function(val){
  while(this[0] !== val){
		this.rotate();
  }
  return this;
};
Array.prototype.whichMax = function () {
	if (!this.length || this.length === 0)
		{return null;}
		
	if (this.length === 1)
		{return 0;}
	
  var max = this[0].y;
  var maxIndex = 0;
  
  for (var i = 1; i < this.length; i++) {
    if (this[i].y > max) {
      maxIndex = i;
      max = this[i].y;
    }
  }
  return maxIndex;
};
Array.prototype.cumsum = function () {
	for (var _cumsum = [this[0]], i = 0, l = this.length-1; i<l; i++) 
    {_cumsum[i+1] = _cumsum[i] + this[i+1];}
	
	return _cumsum;
};
d3.selection.prototype.selectP =function(selector){
	var parent = this.node().parentNode;
	while(parent){       
		if(parent.matches(selector))
			{return d3.select(parent);}
		
		parent = parent.parentNode;
	}
	return null;
};
d3.selection.prototype.toggleClass = function(class_name){
	return this.classed(class_name, !this.classed(class_name));
};
d3.selection.prototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};