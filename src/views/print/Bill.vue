<template>
  <div class="con">
    <p class="p1">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis veniam quidem placeat nam
      velit fugit illo et reprehenderit, minima tempore laboriosam, quam accusamus veritatis aliquid
      reiciendis sequi libero eos voluptate?
    </p>
    <p class="p2">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas beatae, maxime excepturi
      reiciendis consectetur eius modi quos? Blanditiis consectetur voluptatum quam harum dicta
      repellendus ullam provident assumenda voluptatibus tenetur! Sunt.
      <br />
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas beatae, maxime excepturi
      reiciendis consectetur eius modi quos? Blanditiis consectetur voluptatum quam harum dicta
      repellendus ullam provident assumenda voluptatibus tenetur! Sunt.
    </p>

    <table class="t1">
      <thead>
        <tr>
          <th></th>
          <th>100m</th>
          <th>1500m</th>
          <th>Hurdles</th>
          <th>Long Jump</th>
          <th>High Jump</th>
          <th>Javelin</th>
          <th>Discus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Dave</th>
          <td>9.65</td>
          <td>3:49</td>
          <td>12.64</td>
          <td>8.54m</td>
          <td>1.95m</td>
          <td>56.65m</td>
          <td>47.63m</td>
        </tr>
        <tr>
          <th>Simon</th>
          <td>9.87</td>
          <td>3:52</td>
          <td>11.89</td>
          <td>8.16m</td>
          <td>1.96m</td>
          <td>59.03m</td>
          <td>45.72m</td>
        </tr>
        <tr>
          <th>Fred</th>
          <td>9.67</td>
          <td>3:52</td>
          <td>12.03</td>
          <td>8.04m</td>
          <td>2.01m</td>
          <td>62.58m</td>
          <td>46.83m</td>
        </tr>
        <tr>
          <th>Gary</th>
          <td>9.77</td>
          <td>3:56</td>
          <td>13.04</td>
          <td>7.96m</td>
          <td>2.02m</td>
          <td>63.87m</td>
          <td>47.73m</td>
        </tr>
        <tr>
          <th>Dick</th>
          <td>9.95</td>
          <td>3:44</td>
          <td>12.99</td>
          <td>5.66m</td>
          <td>1.97m</td>
          <td>56.43m</td>
          <td>43.87m</td>
        </tr>
        <tr>
          <th>Tom</th>
          <td>9.84</td>
          <td>3:48</td>
          <td>12.86</td>
          <td>6.87m</td>
          <td>1.95m</td>
          <td>67.03m</td>
          <td>42.73m</td>
        </tr>
        <tr>
          <th>Harry</th>
          <td>9.91</td>
          <td>3:53</td>
          <td>13.77</td>
          <td>7.34m</td>
          <td>1.94m</td>
          <td>62.84m</td>
          <td>46.72m</td>
        </tr>
      </tbody>
    </table>

    <img v-for="count in dataCount" :key="count" src="@/assets/login-draw.svg" />
  </div>
</template>

<script setup lang="ts">
import { printService } from '@/services/PrintService'

const dataCount = ref<number>(0)

printService.test().then(async () => {
  dataCount.value = 2
  await nextTick()
  if (window.top !== window.self) {
    const imgs = document.images
    let imgCount = 1
    for (const item of imgs) {
      item.onload = () => {
        imgCount++
        if (imgCount === imgs.length) {
          window.print()
        }
      }
    }

    if (imgs.length === 0) {
      window.print()
    }
  }
})
</script>

<style scoped>
@page {
  size: 240mm 140mm;
  margin: 8mm;
}

.con {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  background-color: rgb(246, 232, 216);
  padding: 10px;
}

.p1 {
  font-size: 1.1rem;
  color: red;
}

.p2 {
  break-before: page;
}

.t1 {
  break-before: page;
  background-color: red;
}
</style>
