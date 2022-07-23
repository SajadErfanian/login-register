<template>
  <v-app id="register">
    <!-- backToLogin -->
    <div class="back-btn">
      <v-btn
        transition="scroll-x-reverse-transition"
        small
        elevation="2"
        fab
        @click="backToLogin"
        color="primary"
        ><v-icon small> mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <!-- backToLogin -->

    <v-content>
      <v-container fluid fill-height>
        <!-- alert -->
        <div class="custom-alert">
          <v-alert
            v-model="alert"
            dismissible
            color="red"
            border="left"
            elevation="2"
            colored-border
            transition="scroll-x-reverse-transition"
            type="error"
          >
            {{ message }}
          </v-alert>
        </div>
        <!-- alert -->

        <!-- otp modal (Verify user)-->
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <div>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>OTP Verify</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <p>
                    There is no user account with mobile number
                    <strong>{{ userMobile }}.</strong> To create a new account,
                    a confirmation code was sent to this number.
                  </p>
                  <div>
                    <div
                      class="ma-auto position-relative"
                      style="max-width: 300px"
                    >
                      <v-otp-input
                        v-model="otpMessage"
                        :disabled="loading"
                        @change="sendOtp"
                        :length="length"
                      ></v-otp-input>
                      <v-overlay absolute :value="loading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-overlay>
                    </div>
                    <div class="text--caption">Type or copy/paste.</div>
                  </div>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-space-between pl-4 pr-4 pb-4"
                >
                  <a @click="backToLogin">Back To Login</a>
                  <v-btn @click="clear" type="submit">clear</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
        <!-- otp modal (Verify user)-->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Verify",
  props: ["type"],
  data() {
    return {
      message: "",
      phoneNumber: "",
      alert: false,
      otpMessage: "",
      Register: "Register",
      ForgotPass: "ForgotPass",
      loading: false,
      length: 5,
    };
  },
  computed: {
    ...mapState(["userMobile", "otpRules"]),
  },
  methods: {
    clear() {
      this.otpMessage = "";
    },
    // submit form for otp message
    sendOtp() {
      this.loading = true;
      // if user first time login to website
      if (this.type === "LOGIN") {
        const loginVerify = {
          key: this.otpMessage,
          mobile: this.userMobile,
          scope: this.Register,
        };

        axios
          .post("https://api.vandar.io/v2/mobile/verify", loginVerify)
          .then((res) => {
            if (res.data.status === 1) {
              this.$emit("openRegister");
            }
          })
          .catch((err) => {
            if (err.response.data.status === 0) {
              this.alert = true;
              this.loading = false;
              this.message = "login The entered code is incorrect";
            }
          });
      }
      // if user want reset password
      else {
        const resetPasswordVerify = {
          key: this.otpMessage,
          mobile: this.userMobile,
          scope: this.ForgotPass,
        };

        axios
          .post("https://api.vandar.io/v2/change/password", resetPasswordVerify)
          .then((res) => {
            if (res.data.status === 1) {
              localStorage.setItem("token", res.data.token);
              this.$router.push("/Home");
            }
          })
          .catch((err) => {
            if (err.response.data.status === 0) {
              this.alert = true;
              this.loading = false;
              this.message = "The entered code is incorrect";
            }
          });
      }
      // if user want reset password
    },
    // submit form for otp message
    backToLogin() {
      this.$emit("backToLogin");
    },
    // back to login
  },
};
</script>
<style scoped>
.custom-alert {
  position: absolute;
  top: -55px;
  right: 0;
  z-index: 99;
}
.back-btn {
  position: fixed;
  right: 15px;
}
.position-relative {
  position: relative;
}
</style>

