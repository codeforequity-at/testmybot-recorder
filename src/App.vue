<template>
  <div class="container">
		<div class="row">
			<div class="col-lg-2 col-md-4">
				<AppNav />
			</div>
			<div class="col-lg-10 col-md-8">
				<router-view class="pl-2"/>
			</div>
		</div>
  </div>
</template>

<script>
import AppNav from '@/components/AppNav';

export default {
  name: 'app',
  components: { AppNav },
};
</script>

<style>
	body {
		padding-top: 30px; 
	}
	html { 
		overflow-y: scroll;
	}
</style>
