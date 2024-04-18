<template>
  <ElCard>
    <p class="mb-2">基础用法</p>
    <div class="max-w-3xl resize-x overflow-hidden border-2 p-3">
      <AppTextEllipsis>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea dolores inventore magni
        nesciunt, eligendi saepe dolore consectetur perspiciatis rem quod repellat illum tempore
        quos id, ipsam asperiores, <em class="text-yellow-300">enim quaerat? Sit totam</em>, dolorum
        dolore impedit earum laudantium omnis rerum libero ex adipisci architecto quae magnam quo
        atque odio tempore nostrum maiores ab labore debitis?
        <span class="text-red-300">
          Illum similique exercitationem sequi quod atque maxime quidem asperiores aliquid quis.
        </span>
      </AppTextEllipsis>

      <AppTextEllipsis>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt, ut.
      </AppTextEllipsis>

      <AppTextEllipsis>
        Illum similique exercitationem sequi quod atque maxime quidem asperiores aliquid quis.
        Repudiandae pariatur ex inventore nostrum cum repellendus ipsa deleniti vel delectus,
        minima, non animi, doloribus voluptas error exercitationem perferendis fugit est nobis vero.
        Nam praesentium velit dolor quaerat voluptate ad, facilis quos fugiat maiores delectus
        exercitationem?
      </AppTextEllipsis>
    </div>

    <p class="mt-5">自定义Tooltip内容</p>
    <ElButton type="primary" class="my-3" size="default" @click="handleChangeTooltip">
      改变Tooltip内容
    </ElButton>
    <div class="max-w-3xl resize-x overflow-hidden border-2 p-3">
      <AppTextEllipsis
        :tooltip-props="{
          content: `现在的时间是：${nowDateTime}`
        }"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati veniam eos dignissimos
        architecto ab pariatur nobis accusantium, vitae atque doloremque ratione? Quasi ducimus iure
        aliquid neque fuga ad voluptatum exercitationem.
      </AppTextEllipsis>
      <AppTextEllipsis>
        <template #content>
          <label>现在的时间是：</label>
          <br />
          <span class="text-yellow-500">{{ nowDateTime }}</span>
        </template>

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore neque id hic voluptatibus
        impedit, dignissimos officiis rem. Magnam quod a harum rerum maxime ut expedita earum nisi
        voluptatum cumque veniam nostrum ab distinctio sapiente, aut quisquam doloremque debitis
        corrupti cupiditate.
      </AppTextEllipsis>
    </div>

    <p class="mt-5">多行文本内容</p>
    <div class="max-w-3xl resize-x overflow-hidden border-2 p-3">
      <AppTextEllipsis
        line-clamp="5"
        :tooltip-props="{
          hideAfter: 100,
          popperClass: 'custom-popover'
        }"
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum accusantium modi ab! Porro
        aperiam error repudiandae, laborum accusamus earum cumque voluptatibus, assumenda
        reprehenderit repellendus odit, amet maxime. Necessitatibus soluta assumenda nam nesciunt
        error rem, eveniet, enim iure consequuntur quis nisi dicta magnam consectetur placeat.
        Maiores, ea architecto pariatur ullam ab nemo. Facilis omnis ad dolores quas vitae vero?
        Pariatur corporis quas et asperiores libero eveniet maiores, voluptates fuga minima
        perferendis ab sed eligendi saepe corrupti nulla ipsam aliquam quod. Nulla assumenda quis
        ipsam delectus enim mollitia quod minus. Exercitationem quidem sunt nobis fugit! Ex culpa
        modi vero qui. Quidem saepe quam nemo nulla amet, officiis voluptatibus quisquam ab labore
        beatae vero facere aperiam accusamus iusto, soluta ducimus maiores assumenda aliquid optio
        obcaecati. Quibusdam omnis, quis officiis provident animi architecto ducimus corrupti
        obcaecati tenetur, atque labore eaque? Velit voluptatibus ducimus recusandae a sunt
        voluptas, sapiente similique culpa laboriosam maxime corrupti accusantium optio facilis,
        ratione, doloribus perspiciatis perferendis nam quas facere non et omnis odio! Explicabo
      </AppTextEllipsis>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
const nowDateTime = ref(new Date().toLocaleString())

const handleChangeTooltip = () => {
  nowDateTime.value = new Date().toLocaleString()
}
</script>
