<template>
  <div>
    <b-list-group-item 
      v-for="recordedMessage in convo"
      :key="recordedMessage.index">

      <b-media right-align v-if="recordedMessage.from === 'me'">
        <i slot="aside" class="fa fa-lg fa-user"></i>
        <p class="text-right">{{ recordedMessage.text }}</p>
      </b-media>
      <b-media v-if="recordedMessage.from === 'bot'">
        <i slot="aside" class="fa fa-lg fa-android" ></i>
        <p>{{ recordedMessage.text }}</p>
      </b-media>
    
    </b-list-group-item>
  </div>
</template>

<script>

export default {
  name: 'ChatView',
  props: ['convo'],
};
</script>

<style scoped>

</style>
