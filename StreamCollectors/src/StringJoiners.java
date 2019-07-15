
	import java.util.StringJoiner;  
	public class StringJoiners {  
	    public static void main(String[] args) {  
	    	/* Passing comma(,) as delimiter and opening bracket
	    	 * "(" as prefix and closing bracket ")" as suffix
	    	 */
	        StringJoiner mystring = new StringJoiner(",", "(", ")");    
	          
	        // Joining multiple strings by using add() method  
	        mystring.add("Sky");  
	        mystring.add("is");  
	        mystring.add("in");  
	        mystring.add("blue");  
	                  
	        // Displaying the output String
	        System.out.println(mystring);  
	    }  
	}
