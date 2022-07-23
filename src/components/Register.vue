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

        <!-- popUp -->
        <div>
          <div class="text-center">
            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Privacy Policy
                </v-card-title>

                <v-card-text>
                  {{ dialogMessage }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="closedialog">
                    back To Login
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <!-- popUp -->

        <!-- forme -->
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <form @submit.prevent="submitForm">
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Register</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      v-model="nationalCode"
                      label="nationalCode"
                      type="number"
                      hint="At least 10 characters"
                      name="input-10-0"
                      :rules="[
                        nationalCodeRules.required,
                        nationalCodeRules.min,
                      ]"
                      required
                      :counter="10"
                    ></v-text-field>
                    <v-text-field
                      v-model="firstName"
                      label="firstName"
                      :rules="nameRules"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="lastName"
                      :rules="lastRules"
                      label="lastName"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="userPassword"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passRules.required, passRules.min]"
                      :type="showPass ? 'text' : 'password'"
                      name="input-8-1"
                      label="Enter your password"
                      hint="At least 8 characters/capital letter"
                      counter
                      @click:append="showPass = !showPass"
                    ></v-text-field>
                    <!-- date picker -->
                    <div class="date-picker mt-4">
                      <v-menu
                        v-model="datePicker"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Birthday date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="datePicker = false"
                        ></v-date-picker>
                      </v-menu>
                    </div>
                    <!-- date picker -->
                  </v-form>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-space-between pl-4 pr-4 pb-4"
                >
                  <v-btn @click="clear"> clear </v-btn>
                  <v-btn color="success" type="submit">Register</v-btn>
                </v-card-actions>
              </v-card>
            </form>
          </v-flex>
        </v-layout>
        <!-- forme -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      dialog: false,
      datePicker: "",
      date: "",
      dialogMessage: "",
      message: "",
      nationalCode: "",
      firstName: "",
      lastName: "",
      userPassword: "",
      showPass: false,
      passRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      nationalCodeRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 10 || "Min 10 characters",
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length > 3 || "Name must be less than 3 characters",
      ],
      lastRules: [
        (v) => !!v || "Last name is required",
        (v) => v.length > 3 || "Name must be less than 3 characters",
      ],
      alert: false,
      otpMessage: "",
      Register: "Register",
      bDayData: [],
    };
  },
  computed: {
    ...mapState(["userMobile"]),
  },
  methods: {
    // clear modal input
    clear() {
      this.firstName = "";
      this.lastName = "";
      this.userPassword = "";
      this.nationalCode = "";
    },
    // clear modal input

    // close dialog popup
    closedialog() {
      this.dialog = false;
      this.$emit("backToLogin");
    },
    // close dialog popup

    // register user (phone number/first name/last name/Birthday date/national_code/)
    submitForm() {
      const bDay = this.date.split("-");
      this.bDayData = bDay;

      const registerUserData = {
        mobile: this.userMobile,
        national_code: this.nationalCode,
        fname: this.firstName,
        lname: this.lastName,
        password: this.userPassword,
        year: this.bDayData[0],
        month: this.bDayData[1],
        day: this.bDayData[2],
        scope: this.Register,
      };
      axios
        .post("https://api.vandar.io/v2/register", registerUserData)
        .then((res) => {
          if (res.data.status === 1) {
            this.alert = true;
            this.message = "congratulation😍🍸";
            this.$router.push("/Home");
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            this.dialog = true;
            this.dialogMessage =
              "The verification code has expired. Please start the registration process from the beginning";
            this.message = "Try Again";
          }
          if (err.response.status === 422) {
            console.log(err.response.data.errors.national_code);
            this.alert = true;
            // this.message = err.response;
          }
        });
    },
    // register user (phone number/first name/last name/Birthday date/national_code/)
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

