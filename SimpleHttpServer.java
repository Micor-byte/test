import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class SimpleHttpServer {

    public static void main(String[] args) throws IOException {
        // Create an HTTP server that listens on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Define a context (route) for the "/upload" path
        server.createContext("/upload", new UploadHandler());
        
        // Start the server
        server.setExecutor(null); // Creates a default executor
        System.out.println("Server started at http://localhost:8080");
        server.start();
    }

    // Handler for the "/upload" endpoint
    static class UploadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers to allow requests from any origin
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            // If it's an OPTIONS request (preflight request), just return 200 and exit
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            // Only handle POST requests
            if ("POST".equals(exchange.getRequestMethod())) {
                // Get the request body (the text content)
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader reader = new BufferedReader(isr);
                StringBuilder requestBody = new StringBuilder();
                String line;
                
                while ((line = reader.readLine()) != null) {
                    requestBody.append(line);
                }
                
                String jsonData = requestBody.toString();
                System.out.println("Received data: " + jsonData);

                // Store data in a JSON file
                saveDataToFile(jsonData);

                // Send a response back (acknowledgement or further processing can be done)
                String response = "{\"status\": \"success\", \"message\": \"Data received and saved!\"}";

                // Send response headers and body
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }

        // Method to save data to a JSON file (simple string-based approach)
        private void saveDataToFile(String jsonData) {
            try {
                // Create a file (or append to an existing file)
                File file = new File("data.json");
                BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));

                // Write the incoming JSON data directly to the file
                writer.write(jsonData + "\n");  // Each entry is on a new line
                writer.close();
                System.out.println("Data saved to file.");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
