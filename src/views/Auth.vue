 <template>
  <v-container>
    <Login
      v-if="login"
      @openVerify="openVerifyModal"
      @openResetPass="openForgetPassModal"
    />
    <Verify
      v-if="verify"
      :type="verifyType"
      @backToLogin="openLoginModal"
      @openRegister="openRegisterMobile"
    />
    <Register v-if="register" @backToLogin="openLogin" />
    <resetPassword
      v-if="resetPassword"
      @backToLogin="openLoginModallOfResetPass"
      @openVerify="openVerifyModalOfResetPass"
    />
  </v-container>
</template>

<script>
import Verify from "../components/Verify.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import resetPassword from "../components/resetPassword.vue";
export default {
  name: "Auth",
  components: {
    Login,
    Verify,
    Register,
    resetPassword,
  },
  data() {
    return {
      login: true,
      verify: false,
      register: false,
      resetPassword: false,
      verifyType: null,
    };
  },
  methods: {
    // Login component-------
    openVerifyModal(data) {
      this.verifyType = data.type;
      this.login = false;
      this.verify = true;
    },
    openForgetPassModal() {
      this.login = false;
      this.resetPassword = true;
    },
    // Login component-------

    // Verify component-------
    openLoginModal() {
      this.verify = false;
      this.login = true;
    },
    openRegisterMobile() {
      this.verify = false;
      this.register = true;
    },
    // Verify component-------

    // Register component-------
    openLogin() {
      this.register = false;
      this.login = true;
    },
    // Register component-------

    // resetPassword component-------
    openVerifyModalOfResetPass(data) {
      this.verifyType = data.type;
      this.resetPassword = false;
      this.verify = true;
    },
    openLoginModallOfResetPass() {
      this.resetPassword = false;
      this.login = true;
    },
    // resetPassword component-------
  },
};
</script>

<style>
</style>