package com.web.curation.config.firebase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.web.curation.model.alarm.FcmMessage;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.apache.http.HttpHeaders;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collections;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Component
public class FirebaseCloudMessageService {
    private final String API_URL = "https://fcm.googleapis.com/v1/projects/\n" +
            "webproject-1559735149402/messages:send";
    private final ObjectMapper objectMapper;


    public void sendMessageTo(String targetToken, String title, String body) throws IOException{
        String message = makeMessage(targetToken, title, body);

        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(message, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(API_URL)
                .post(requestBody)
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
                .build();
        Response response = client.newCall(request)
                .execute();
        System.out.println(response.body().string());

    }

    private String makeMessage(String targetToken, String title, String body) throws JsonProcessingException {
        FcmMessage fcmMessage = FcmMessage.builder()
                .message(FcmMessage.Message.builder()
                    .token(targetToken)
                    .notification(FcmMessage.Notification.builder()
                        .title(title)
                        .body(body)
                        .image(null)
                        .build()
                    )
                .build()
                )
                .validate_only(false)
                .build();
        return objectMapper.writeValueAsString(fcmMessage);
    }

    private String getAccessToken() throws IOException{
        String firebaseConfigPath = "firebase service key.json";

        GoogleCredentials googleCredential = GoogleCredentials.fromStream(
                new ClassPathResource(firebaseConfigPath).getInputStream()
        ).createScoped(Collections.singleton("https://www.googleapis.com/auth/cloud-platform"));

        googleCredential.refreshIfExpired();

        return googleCredential.getAccessToken().getTokenValue();

    }
}
