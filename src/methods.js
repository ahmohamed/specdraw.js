/************************** Methods modals **************************/

var makeMethodParams = function(params){
  return function(div){
		//console.log(div[0][0].children)
		
    for (var key in params){
			var p = params[key];
			if(typeof p == 'function') continue; //Exclude Array prototype functions.
				
      var label = div.append("label")
      	.text(key).classed("param", true);
			
			label.node().id = key;
			//console.log(div[0][0].children, key)
				
      parseParams.apply(label, p);      
    }
  };
};

var parseParams = function(label, type, val, fields, fields_label){
  if(label)
    this.text(label);
  
	var input;

  if(type === 0){
		input = this.append("input").attr("type", "number");
  
	  if(!(typeof val === "undefined"))
  	  input.attr("value", val);
  }
	else if(type === 1){
		input = this.append("input").attr("type", "checkbox");
		if(val)
			input.attr("checked", true)
	}
  else if(type === 3){
  	input = this.append("select");
		
		if(fields.constructor === Array){
			input.selectAll("option")
				.data(fields)
				.enter()
				.append("option")
				.attr("value", function(d){return d[0];})
				.text(function(d){return d[1];})
			
		}else{
			input.selectAll("option")
				.data(Object.keys(fields))
				.enter()
				.append("option")
				.attr("value", function(d){return d;})
				.text(function(d){return fields[d][0];})			
			
			input.on("input", function(){
				d3.select(this.parentNode).select(".method_params").select("fieldset").remove();
			  d3.select(this.parentNode).select(".method_params")
			    .append("fieldset")
			  	.call(makeMethodParams(fields[this.value][1]))
				  .append("legend").text( fields_label? fields_label : "Parameters");
			});
			
			this.append("div")
				.classed("method_params", true)
				.append("fieldset")	
				.call(makeMethodParams(fields[input.node().value][1]))
				.append("legend").text(fields_label? fields_label : "Parameters");
		}
  }
  else if(type === 5){		
		this.text(" ");
    input = this.append("input").attr("type", "button")
			.attr("value", label)
    	.on("click", function(){ fireEvent(this, 'input') });
  }
	
  return input;
};

var methods = {}

methods.bl = 
{
	"a":["Baseline correction method", 3, null,
		{
			'cbf':["Constant",
				{"last":["Percentage of points used to calculate baseline", 0, 10]}
			], 
			'med':["Median filter",
				{
		     "mw":["Median window size",0,200],
		     "sf":["Smooth window size", 0,16],
		     "sigma":["sigma" , 0, 5],
		  	}
			],
			'polynom':["Polynomial", {"n":["Order", 0, 3]}],
			'cos':["Cosine series", {"n":["Order", 0, 3]}],
			'bern':["Bernstein polynomials", {"n":["Order", 0, 3]}],
			'iter_polynom':["Iterative Polynomial", {"n":["Order", 0, 3]}],			
			'airpls':["airPLS", {"n":["Order", 0, 1], "lambda":["lambda", 0, 10]}],
			'whit':["Whittaker smoother", {}],
			'th':["Tophat", {}],
			'als':["Asymmetric least squares", {}],
			'fft':["Low FFT filter", {}],
		}
	],
	"prev":["Preview", 3, null, [[0,"Estimated baseline"], [1,"Corrected spectrum"]] ],
	"prev_auto":["Auto Preview", 1, true],
	"prev_btn":["Apply Preview", 5, null]
};
methods.ps = 
{
	"a":["Phase correction method", 3, null,
		{
			'auto':["Automatic",
				{"opt":["Optimization", 3, null, 
						[['auto',"Sequential optimization of zero & first order phases"],
						['autosim',"Simultaneous optimization of zero & first order phases"],
						['auto0',"Zero order phase only"]] 
					],
				"obj":["Objective function", 3, null, 
						[['entropy', "Entropy minimization"],['integ', "Integral maximization"],['minp', "Minimum point maximization"]]
					]
				}
			], 
			'atan':["Automatic using Arc tan method",
				{"p0":["Zero order only", 1, false]}
			],
			'man':["Manual", 
				{
		     "p0":["Zero order",0,0],
		     "p1":["First order", 0,0]
		  	}
			],
		}
	],
	"prev_auto":["Auto Preview", 1, true],
	"prev_btn":["Preview Corrected", 5, null]
};