<template>
  <div>
    <div class="row">
      <div class="mb-2">
        <img class="img-fluid img-thumbnail" src="../assets/testmybot_logo.png">
      </div>
    </div>
    <div class="row d-flex flex-column">
        <b-dropdown 
          size="lg"
          :text="selectedsuite.name"
          class="flex-column">
          <b-dropdown-header v-if="testsuites.length > 0">Select Test Suite</b-dropdown-header>
          <b-dropdown-item-button v-for="ts in testsuites">
            {{ ts.name }}
          </b-dropdown-item-button>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item-button>New Test Suite</b-dropdown-item-button>
        </b-dropdown>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ul class="nav nav-pills flex-column">
          <li class="nav-item">
            <router-link to="/" exact-active-class="active" class="nav-link">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Record" exact-active-class="active" class="nav-link">1. Record</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Manage" exact-active-class="active" class="nav-link">2. Organize</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Run" exact-active-class="active" class="nav-link">3. Run</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNav',
  data() {
    return {
      testsuites: [
        { name: 'Calculator' },
        { name: 'Oktocheck' },
      ],
      selectedsuite: { name: 'Calculator' },
    };
  },
};
</script>

<style scoped>
.nav li a {
    font-size: 150%;
    font-weight: bold;
}
</style>
