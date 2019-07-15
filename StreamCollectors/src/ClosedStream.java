

	import java.util.Arrays;
	import java.util.stream.Stream;

	public class ClosedStream {

	    public static void main(String[] args) {

	        String[] array = {"a", "b", "c", "d", "e"};
	        Stream<String> stream = Arrays.stream(array);

	        // loop a stream
	        stream.forEach(x -> System.out.println(x));

	        // reuse it to filter again! throws IllegalStateException
	        long count = stream.filter(x -> "b".equals(x)).count();
	        System.out.println(count);

	    }

	}


