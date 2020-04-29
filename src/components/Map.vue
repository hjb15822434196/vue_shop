<template>
      <div id="allmap">
      </div>
</template>

<script>

  var map = require("../assets/js/map.js");
  export default {
    data() {
      return {
        ak: "brdBS22T3Ic5zeAqnqHXGisSWhQNU91P"
      }
    },
    mounted() {
      this.$nextTick(function () {
        var _this = this;
        map.MP(_this.ak).then(BMap => {
          // 百度地图API功能
          var map = new BMap.Map("allmap");
          var point = new BMap.Point(116.331398, 39.897445);
          map.centerAndZoom(point, 12);

          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              var mk = new BMap.Marker(r.point);
              map.addOverlay(mk);
              map.panTo(r.point);
              alert('您的位置：' + r.point.lng + ',' + r.point.lat);
            }
            else {
              alert('failed' + this.getStatus());
            }
          }, {enableHighAccuracy: true})
        })
      })

    },

  }
</script>

<style scoped>
  body, html, #allmap {
    width: 1350px;
    height: 600px;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }

</style>
