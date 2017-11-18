<template>
  <div>
    <div class="row">
      <div class="thumbnail">
      <img class="img-responsive" src="../assets/testmybot_logo.png">
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ul class="nav nav-pills nav-stacked">
          <router-link tag="li" to="/" exact-active-class="active">
            <a>Dashboard</a>
          </router-link>  
          <router-link tag="li" to="/Record" exact-active-class="active">
            <a>1. Record</a>
          </router-link>  
          <router-link tag="li" to="/Manage" exact-active-class="active">
            <a>2. Organize</a>
          </router-link>  
          <router-link tag="li" to="/Run" exact-active-class="active">
            <a>3. Run</a>
          </router-link>  
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNav',
};
</script>

<style scoped>
.nav li a {
    font-size: 150%;
    font-weight: bold;
}
</style>
