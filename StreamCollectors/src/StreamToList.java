

	import java.util.List;
	import java.util.stream.Collectors;
	import java.util.stream.Stream;

	public class StreamToList {

	    public static void main(String[] args) {

	        Stream<Integer> number = Stream.of(22,1,3,2,6);

	        List<Integer> result2 = number.filter(x -> x != 3).collect(Collectors.toList());

	        result2.forEach(x -> System.out.println(x));


	    }
	
}
