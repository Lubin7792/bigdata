<template>
  <div class="hello">
    <!-- <iframe src="http://10.60.127.130/hhgbi/v5/design/report/18373dfc819c456ea15e6e9d15f8d472/view" width="1200" height="300" frameborder="0" scrolling="auto"style="position:absolute;top: -300px;left: 0px;"></iframe> -->

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    this.axios.get('http://127.0.0.1:3000/api/getData').then((response)=>{
                console.log(response.data)
            }).catch((response)=>{
                console.log(response)
            })
  },
  methods: {
   
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
