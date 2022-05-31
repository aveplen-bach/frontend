<template>
  <!-- <div class="card">
    <div class="card-body container">
      <div class="row">
        <div class="col-md-6">
          <div class="camera-container card-img-left">
            <camera
              :resolution="{ width: 500, height: 500 }"
              ref="camera"
              autoplay
            ></camera>
          </div>
          <button @click="snapshot">Create snapshot</button>
        </div>
        <div class="col-md-6">
          <form class="form-signin">
            <div class="text-center mb-4">
              <img
                class="mb-4"
                src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
                alt=""
                width="72"
                height="72"
              />
              <h1 class="h3 mb-3 font-weight-normal">Floating labels</h1>
              <p>
                Build form controls with floating labels via the
                <code>:placeholder-shown</code> pseudo-element.
                <a href="https://caniuse.com/#feat=css-placeholder-shown"
                  >Works in latest Chrome, Safari, and Firefox.</a
                >
              </p>
            </div>

            <div class="form-label-group">
              <input
                type="email"
                id="inputEmail"
                class="form-control"
                placeholder="Email address"
                required
                autofocus
              />
              <label for="inputEmail">Email address</label>
            </div>

            <div class="form-label-group">
              <input
                type="password"
                id="inputPassword"
                class="form-control"
                placeholder="Password"
                required
              />
              <label for="inputPassword">Password</label>
            </div>

            <div class="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
          </form>
        </div>
      </div>
    </div>
  </div> -->
  <div class="container-fluid h-custom" style="margin-top: 100px">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="shadow card col-xl-8" style="background-color: #ffffdd">
        <div class="card-body container">
          <div class="row">
            <div class="col-md-6 col-lg-5 col-xl-6" style="padding: 10px">
              <div
                class="rounded shadow"
                style="width: 400px; height: 400px; overflow: hidden"
              >
                <camera
                  :resolution="{ width: 500, height: 500 }"
                  ref="camera"
                  autoplay
                >
                  <div
                    style="
                      background-color: yellow;
                      opacity: 10%;
                      width: 100%;
                      height: 100%;
                      box-shadow: 20px 14px 34px 0px rgba(255, 255, 255, 0.2)
                        inset;
                    "
                  ></div>
                </camera>
              </div>
            </div>
            <div
              class="col-md-6 col-lg-7 col-xl-6"
              style="padding-left: 10px; padding-right: 10px; padding-top: 90px"
            >
              <form>
                <!-- Email input -->
                <div class="form-outline mb-4">
                  <input
                    type="email"
                    id="form3Example3"
                    class="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                  />
                  <label class="form-label" for="form3Example3"
                    >Email address</label
                  >
                </div>

                <!-- Password input -->
                <div class="form-outline mb-3">
                  <input
                    type="password"
                    id="form3Example4"
                    class="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                  <label class="form-label" for="form3Example4">Password</label>
                </div>

                <div class="text-center mt-4 pt-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg"
                    style="padding-left: 2.5rem; padding-right: 2.5rem"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="
      d-flex
      flex-column flex-md-row
      text-center text-md-start
      justify-content-between
      py-4
      px-4 px-xl-5
      border
    "
    style="
      position: absolute;
      width: 100%;
      bottom: 0;
      background-color: #ffffdd;
    "
  >
    <!-- Copyright -->
    <div class="mb-3 mb-md-0">Copyright © 2020. All rights reserved.</div>
    <!-- Copyright -->

    <!-- Right -->
    <div>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-google"></i>
      </a>
      <a href="#!" class="text-white">
        <i class="fab fa-linkedin-in"></i>
      </a>
    </div>
    <!-- Right -->
  </div>
</template>

<script lang="ts">
import Camera from "simple-vue-camera";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const preview = ref("");
    const camera = ref<InstanceType<typeof Camera>>();

    const snapshot = async () => {
      const blob = await camera.value?.snapshot();
      if (blob) {
        preview.value = URL.createObjectURL(blob);
      }
    };

    return {
      camera,
      snapshot,
      preview,
    };
  },
});
</script>

<style lang="scss">
// Colors
$bg-color: hsl(99, 99, 95);
$dot-color: hsl(1, 1, 1);

// Dimensions
$dot-size: 1px;
$dot-space: 11px;

body {
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}

/* :root {
  --input-padding-x: 0.75rem;
  --input-padding-y: 0.75rem;
}

html,
body {
  height: 100%;
}

 body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.camera-container {
  width: 100%;
  max-width: 600px;
  max-height: 600px;
  padding: 15px;
  margin: 0 auto;
}

.form-signin {
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: 0 auto;
}

.form-label-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
  padding: var(--input-padding-y) var(--input-padding-x);
}

.form-label-group > label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0;
  line-height: 1.5;
  color: #495057;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
  color: transparent;
}

.form-label-group input:-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-moz-placeholder {
  color: transparent;
}

.form-label-group input::placeholder {
  color: transparent;
}

.form-label-group input:not(:placeholder-shown) {
  padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
  padding-bottom: calc(var(--input-padding-y) / 3);
}

.form-label-group input:not(:placeholder-shown) ~ label {
  padding-top: calc(var(--input-padding-y) / 3);
  padding-bottom: calc(var(--input-padding-y) / 3);
  font-size: 12px;
  color: #777;
} */
</style>