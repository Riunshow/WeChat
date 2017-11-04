<template lang="pug">
.container
  .house(ref='house')
    .house-content(v-for='(item, index) in houses' :key='index' @click='focusHouse(item)')
      .house-text
        .words {{ item.words }}
        .cname {{ item.name }}
        .name {{ item.cname }}

  .character
    .title 主要人物
    .section
      .items(v-for="(item, index) in characters" :key="index" @click="showCharacter(item)")
        img(:src='item.profile')
        .desc
          .cname {{item.cname}}
          .name {{item.name}}
          .playedBy {{item.playedBy}}        

  .city
    .city-title 大陆
    .intro 描述
    .items(v-for="(item, index) in cities" :key="index" )
      .title {{item.title}}
      .body {{item.body}}
</template>

<script>
import { mapState } from "vuex";

export default {
  head() {
    return {
      title: "人物介绍"
    };
  },

  computed: {
    ...mapState(["houses", "characters", "cities"])
  },

  methods: {
    showHouse(item) {
      this.$router.push({
        path: "/house",
        query: {
          id: item._id
        }
      });
    },
    showCharacter(item) {
      this.$router.push({
        path: "/character",
        query: {
          id: item._id
        }
      });
    }
  },

  beforeCreate() {
    this.$store.dispatch('fetchHouses')
    this.$store.dispatch('fetchCharacters')
    this.$store.dispatch('fetchCities')
  }


};
</script>

<style scoped lang="sass" src='../static/sass/index.sass'></style>