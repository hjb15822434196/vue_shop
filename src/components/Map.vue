<template>
  <div class="hello">

    <baidu-map class="bm-view" :center="{lng: mapArr.lng, lat: mapArr.lat}" :zoom="15" :scroll-wheel-zoom="true">
      <bm-marker :position="{lng: mapArr.lng, lat: mapArr.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      </bm-marker>
    </baidu-map>
  </div>
</template>
<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        mapArr: {
          lat: 0,
          lng: 0,
        },
      }
    },
    props: ['ipAll'],
    mounted() {

      this.getWd()
    },
    methods: {
      showLocation(e) {//jsonp回调的方法，拿到转换成经纬度的值
        this.mapArr = e.result.location
      },
      getWd() {
        let vm = this;
        vm.$jsonp(

//调用百度地图，获取地理位置的经纬度
          'http://api.map.baidu.com/geocoding/v3/?address=' + vm.ipAll +
          '&output=json&ak=X7UHQqYy3WobTXHk3Mw3oN96ahHcQuuG&callback=showLocation',
        )
          .then(res => {
            vm.showLocation(res)
          })
          .catch(err => {});
      },
    },
    comments: {
// BaiduMap
    }
  }
</script>

<style scoped>
  .bm-view {
    width: 100%;
    height: 300px;
  }

  h1,
  h2 {
    font-weight: normal;
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
