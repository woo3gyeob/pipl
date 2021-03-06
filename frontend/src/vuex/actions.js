import axios from "axios";
import router from "../routes";

export default {
  // 로그인 - 두호
  login({ commit }, credentials) {
    axios({
      url: "https://i5b302.p.ssafy.io/api/account/login",
      method: "post",
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    }).then((res) => {
      let token = res.data;

      commit("UPDATE_TOKEN", res.data);
      localStorage.setItem("token", res.data);
      // 카카오로그인인지 그냥 로그인인지 구별하기 위한 변수 - 종우
      commit("UPDATE_ISLOGINBYKAKAO", false);
      localStorage.setItem("isLoginByKakao", false);

      // vuex 및 localStorage 에 로그인한 유저의 nickname 저장
      axios({
        url: "https://i5b302.p.ssafy.io/api/account/checkJWT",
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": res.data,
        },
      }).then((res) => {
        commit("LOGGED_USER_NAME", res.data.nickname);
        localStorage.setItem("username", res.data.nickname);

        axios({
          url: "https://i5b302.p.ssafy.io/api/alarm/register",
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token,
          },
          data: localStorage.getItem("firebaseToken"),
        }).then(() => router.push({ name: "FeedMain" }));
      });
    });
  },
  firebaseTokenGet({ commit }, firebaseToken) {
    localStorage.setItem("firebaseToken", firebaseToken);
    commit("FIREBASE_TOKEN_GET", firebaseToken);
  },

  searchGet({ commit }, token) {
    axios({
      url: `https://i5b302.p.ssafy.io/api/account/checkJWT`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    }).then((res) => {
      axios({
        url: "https://i5b302.p.ssafy.io/api/search",
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token,
        },
      }).then((res) => {
        commit("SEARCH_GET", res.data);
      });
    });
  },
  searchLive({ commit }, data) {
    axios({
      url: `https://i5b302.p.ssafy.io/api/search/live?nickname=${data.nickname}`,
      method: "get",
    }).then((res) => {
      commit("SEARCH_LIVE", res.data);
    });
  },

  alarmLikeGet({ commit }, token) {
    axios({
      url: "https://i5b302.p.ssafy.io/api/alarm/like",
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    }).then((res) => {
      commit("ALARM_LIKE_GET", res.data);
    });
  },
  alarmFollowGet({ commit }, token) {
    axios({
      url: "https://i5b302.p.ssafy.io/api/alarm/follow",
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    }).then((res) => {
      commit("ALARM_FOLLOW_GET", res.data);
    });
  },
  alarmPromiseGet({ commit }, token) {
    axios({
      url: "https://i5b302.p.ssafy.io/api/alarm/promise",
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => {
        commit("ALARM_PROMISE_GET", res.data);
      })
      .catch((err) => {
        alert(err);
      });
  },

  scrapGet({ commit }, token) {
    axios({
      url: `https://i5b302.p.ssafy.io/api/account/checkJWT`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    }).then(() => {
      axios({
        url: `https://i5b302.p.ssafy.io/api/scrap`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token,
        },
      }).then((res) => {
        commit("SCRAP_GET", res.data);
      });
    });
  },
  scrapDeleteMode({ commit }) {
    commit("SCRAP_DELETE_MODE");
  },

  promiseListGet({ commit }) {
    axios({
      url: "https://i5b302.p.ssafy.io/api/promise",
      method: "get",
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      commit("PROMISE_LIST_GET", res.data);
    });
  },
  promiseDetailGet({ commit }, payload) {
    axios({
      url: `https://i5b302.p.ssafy.io/api/promise/${payload.promiseid}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": payload.token,
      },
    }).then((res) => {
      commit("PROMISE_DETAIL_GET", res.data);
    });
  },

  logout({ commit }) {
    commit("UPDATE_ISLOGINBYKAKAO", false);
    localStorage.setItem("isLoginByKakao", false);
    commit("LOGOUT");
  },

  // kakaoLogin 종우
  kakaoLogin({ commit }) {
    window.Kakao.Auth.login({
      scope: "profile_nickname, profile_image, account_email",
      success: (authObj) => {
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: (res) => {
            const kakao_account = res.kakao_account;
            const userInfo = {
              access_token: authObj.access_token,
              nickname: kakao_account.profile.nickname,
              email: kakao_account.email,
              thumbnail: kakao_account.profile.profile_image_url,
              password: "",
              account_type: 2,
            };
            axios({
              method: "post",
              url: `https://i5b302.p.ssafy.io/api/kakao`,
              params: {
                access_token: userInfo.access_token,
                email: userInfo.email,
                nickname: userInfo.nickname,
                thumbnail: userInfo.thumbnail,
              },
            }).then((res) => {
              let token = res.data;
              commit("UPDATE_TOKEN", res.data);
              localStorage.setItem("token", res.data);
              commit("UPDATE_ISLOGINBYKAKAO", true);
              localStorage.setItem("isLoginByKakao", true);

              axios({
                url: "https://i5b302.p.ssafy.io/api/account/checkJWT",
                method: "get",
                headers: {
                  "Content-Type": "application/json",
                  "X-AUTH-TOKEN": res.data,
                },
              }).then((res) => {
                commit("LOGGED_USER_NAME", res.data.nickname);
                localStorage.setItem("username", res.data.nickname);

                axios({
                  url: "https://i5b302.p.ssafy.io/api/alarm/register",
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                    "X-AUTH-TOKEN": token,
                  },
                  data: localStorage.getItem("firebaseToken"),
                }).then(() => {
                  router.push({ name: "FeedMain" });
                });
              });
            });
          },
          fail: (error) => {
            this.$router.push("/errorPage");
          },
        });
      },
    });
  },
  updateLocations({ commit }, payload) {
    axios({
      method: "get",
      url: `https://i5b302.p.ssafy.io/api/promise/place/${payload.promiseid}`,
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": payload.token,
      },
    }).then((res) => {
      commit("UPDATE_LOCATIONS", res.data);
      commit("GET_ATTENDANTS_NUM", res.data.length);
    });
  },
};
