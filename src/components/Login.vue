<template>
  <v-app id="register">
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
        <!-- login modal -->
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <div>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>{{ title }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      v-if="phoneNemberFild"
                      id="phoneNumber"
                      name="login"
                      label="Please enter your mobile number"
                      :counter="11"
                      type="number"
                      v-model="userPhoneNumber"
                      :rules="rules"
                      hide-details="auto"
                    ></v-text-field>
                    <v-text-field
                      v-else
                      v-model="userPassword"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passRules.required, passRules.min]"
                      :type="showPass ? 'text' : 'password'"
                      name="input-10-1"
                      label="Enter your password"
                      hint="At least 8 characters"
                      counter
                      @click:append="showPass = !showPass"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-space-between pl-4 pr-4 pb-4"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="phoneNemberFild"
                    :disabled="disabled"
                    color="success"
                    @click="loginUser"
                    type="submit"
                    >Submit</v-btn
                  >
                  <div
                    v-else
                    class="btn-custom d-flex align-center justify-space-between"
                  >
                    <a @click="forgetPassword">forget password</a>
                    <v-btn color="success" @click="sendPassword" type="submit"
                      >Submit</v-btn
                    >
                  </div>
                </v-card-actions>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
        <!-- login modal -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      title: "Login | Register",
      message: "",
      userPhoneNumber: "",
      userPassword: "",
      alert: false,
      showPass: false,
      phoneNemberFild: true,
      ForgotPass: "ForgotPass",
      disabled: true,
      passRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      otpRules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length == 5) || "5 characters",
      ],
    };
  },
  computed: {
    ...mapState(["rules"]),
  },
  watch: {
    // for enable phone number btn
    userPhoneNumber: function () {
      if (this.userPhoneNumber.length === 11) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    // for enable phone number btn
  },

  methods: {
    // check phone number modal
    loginUser() {
      this.$store.commit("loginUser", this.userPhoneNumber);
      const sendPhoneNumber = {
        mobile: this.userPhoneNumber,
      };
      axios
        .post("https://api.vandar.io/v2/register/check/mobile", sendPhoneNumber)
        .then((res) => {
          if (res.data.status === 0) {
            this.phoneNemberFild = false;
          }
          if (res.data.status === 1) {
            this.$emit("openVerify", { type: "LOGIN" });
          }
        })
        .catch((err) => {
          if (err.response.status === 0) {
            this.alert = true;
            this.message = "The input information is not correct";
          }
        });
    },
    // check phone number modal

    // send phon number and password
    sendPassword() {
      const sendPasswordData = {
        mobile: this.userPhoneNumber,
        password: this.userPassword,
      };
      axios
        .post("https://api.vandar.io/v3/login", sendPasswordData)
        .then((res) => {
          if (res.status === 200) {
            this.phoneNemberFild = false;
            this.$router.push("/Home");
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.alert = true;
            this.message = "your token is expired";
          }
        });
    },
    // send phon number and password

    // forgt password
    forgetPassword() {
      this.$emit("openResetPass");
    },
    // forgt password
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
.btn-custom {
  width: 100%;
}
</style>

