package com.moyamo.be.search.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ElasticSearchService {

    private final RestHighLevelClient client;

    public String findRepresentativeSynonym(String gestureName) {
        try {
            String analyzedToken = analyzeTextWithSynonymAnalyzer(gestureName);

            if (analyzedToken == null || analyzedToken.isEmpty()) {
                return gestureName;
            }

            return analyzedToken;

        } catch (Exception e) {
            e.printStackTrace();
            return gestureName;
        }
    }

    private String analyzeTextWithSynonymAnalyzer(String text) throws IOException {

        Request request = new Request("POST", "/gestures/_analyze");
        request.addParameter("pretty", "true");
        String requestBody = String.format(
                "{ \"analyzer\": \"synonym_analyzer\", \"text\": \"%s\" }",
                text
        );
        request.setJsonEntity(requestBody);

        Response response = client.getLowLevelClient().performRequest(request);
        String responseBody = EntityUtils.toString(response.getEntity());

        JsonNode responseJson = new ObjectMapper().readTree(responseBody);
        JsonNode tokens = responseJson.get("tokens");

        if (tokens != null && tokens.size() > 0) {
            return tokens.get(0).get("token").asText();
        }

        return null;
    }


}
