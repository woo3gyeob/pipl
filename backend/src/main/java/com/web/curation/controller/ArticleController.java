package com.web.curation.controller;

import com.web.curation.dao.article.ArticleDao;
import com.web.curation.dao.scrap.ScrapDao;
import com.web.curation.dao.user.UserDao;
import com.web.curation.model.BasicResponse;
import com.web.curation.model.article.Article;
import com.web.curation.model.scrap.Scrap;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
        @ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
        @ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
        @ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })

@CrossOrigin(origins = { "http://localhost:3000" })
@RequiredArgsConstructor
@RestController
public class ArticleController {

    @Autowired
    ArticleDao articleDao;

    @Autowired
    ScrapDao scrapDao;

    @Autowired
    UserDao userDao;

    @PostMapping("/article/{uid}")
    @ApiOperation(value = "게시글 작성")
    public Object postArticle(@PathVariable final String nickname) {
//        return scrapDao.save(Scrap.builder()
//                .scrapid(null)
//                .id(userid)
//                .articleid(articleid)
//                .build());
        return null;
    }

    @GetMapping("/article/{uid}")
    @ApiOperation(value = "내 피드 보기")
    public Object viewMyFeed(@PathVariable final Long uid) {
        // uid를 통해 해당 유저의 게시글을 불러온다.
        Optional<Article> article = articleDao.findById(uid);
        return new ResponseEntity<>(article, HttpStatus.OK);
    }

    @DeleteMapping("/article/{nickname}/{uid}")
    @ApiOperation(value = "게시글 삭제")
    public Object deleteScrap(@PathVariable final String nickname, @PathVariable final Long articleid){
        articleDao.deleteByArticleid(articleid);
        ResponseEntity response = new ResponseEntity<>("게시글 삭제 완료", HttpStatus.OK);
        return response;
    }

    @GetMapping("/scrap")
    @ApiOperation(value = "스크랩목록 가져오기")
    public Object scraplist(@RequestParam(required = true) final Long userid) {
        ResponseEntity response = null;
        response = new ResponseEntity<>(scrapDao.findById(userid), HttpStatus.OK);
        return response;
    }

    @PostMapping("/scrap/{articleid}")
    @ApiOperation(value = "게시글 스크랩하기")
    public Object doScrap(@PathVariable final Long articleid, @RequestParam(required = true) final Long userid) {
        return scrapDao.save(Scrap.builder()
                .scrapid(null)
                .id(userid)
                .articleid(articleid)
                .build());
    }

    @DeleteMapping("/scrap/{scrapid}")
    @ApiOperation(value = "스크랩 취소")
    public Object deleteScrap(@PathVariable final Long scrapid){
        scrapDao.deleteByScrapid(scrapid);
        ResponseEntity response = new ResponseEntity<>("스크랩 취소 완료", HttpStatus.OK);
        return response;
    }

}
