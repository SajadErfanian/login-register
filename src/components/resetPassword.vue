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

        <!-- reset password -->
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <form @submit.prevent="resetPassword">
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>{{ title }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <p>
                    Password must have at least 8 numbers and (one capital
                    letter)
                  </p>
                  <v-form>
                    <v-text-field
                      v-model="userPassword"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passRules.required, passRules.min]"
                      :type="showPass ? 'text' : 'password'"
                      name="input-10-1"
                      label="Enter your password"
                      hint="At least 8 characters/capital letter"
                      @click:append="showPass = !showPass"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-space-between pl-4 pr-4 pb-4"
                >
                  <a @click="backToLogin">Back To Login</a>
                  <v-btn color="success" type="submit">Submit pas</v-btn>
                </v-card-actions>
              </v-card>
            </form>
          </v-flex>
        </v-layout>
        <!-- reset password -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "resetPassword",
  data() {
    return {
      title: "Reset Password",
      message: "",
      userPassword: "",
      alert: false,
      showPass: false,
      ForgotPass: "ForgotPass",
      passRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
    };
  },
  computed: {
    ...mapState(["userMobile", "rules"]),
  },

  methods: {
    // reset password
    resetPassword() {
      const resetPasswordFormData = {
        mobile: this.userMobile,
        password: this.userPassword,
        scope: this.ForgotPass,
      };
      axios
        .post("https://api.vandar.io/v2/mobile/send", resetPasswordFormData)
        .then((res) => {
          if (res.data.status === 1) {
            this.$emit("openVerify", { type: "RESETPASSWORD" });
          }
        })
        .catch((err) => {
          if (err.response.data.status === 0) {
            this.alert = true;
            this.message =
              "The password format is not valid.Password must have at least 8 numbers and (one capital letter).";
          }
        });
    },
    // reset password

    // back to login modal
    backToLogin() {
      this.$emit("backToLogin");
    },
    // back to login modal
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
</style>

