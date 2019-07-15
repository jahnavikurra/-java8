
	import java.util.List;
	import java.util.stream.Collectors;
	import java.util.stream.Stream;

	public class NullValue{

	    public static void main(String[] args) {

	        Stream<String> language = Stream.of("java", "python", "node", null, "ruby", null, "php");

	        //List<String> result = language.collect(Collectors.toList());

	        List<String> result = language.filter(x -> x!=null).collect(Collectors.toList());

	        //result.forEach(System.out::println);
	        
	        System.out.println("result:"+result);
	        


	    }
	}


