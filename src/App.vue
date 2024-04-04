<template>
  <div class="container">
    <ul class="posts-list">
      <li v-for="post in posts">
        <h2>{{ post.title }}</h2>
        <p class="slug">{{ post.slug }}</p>
        <div
          v-if="!showJSON"
          class="body"
          v-html="markdownJSONToHTML(post.body)"
        ></div>
        <pre v-else>{{ JSON.stringify(post, null, 2) }}</pre>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { markdownJSONToHTML } from './markdown-converter';
import { Post } from './types';

// Axios setup
const token =
  '399b6040045dab1d1cefa88bf41686595c48208b9d4da3d0a430ebd3d7220837dd682e9cabbcc034deb4ba850c344babf4aa6afe6fc939566d75ca40329a5149fcaa69589ffa438ad49dd4ec313d5c72e6fef2c4bcf3059115802efa775dc04cb6647c2c25ad41befeeb9e1fe5d6ef37d8efca9e329dc8808a5764055b5ff47b';
axios.defaults.baseURL = 'https://strapi-production-439d.up.railway.app/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
const posts = ref([] as Post[]);
const showJSON = ref(false);
// @keydown.enter="showJSON = !showJSON"
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') showJSON.value = !showJSON.value;
});

(async () => {
  const { data } = (await (await axios.get('/posts')).data) as { data: any[] };
  posts.value = data.map((d) => {
    const { slug, title, body } = d.attributes;
    return { id: d.id, slug, title, body };
  });
})();
</script>

<style scoped lang="scss">
.container {
  padding: 1.2rem;
}

ul.posts-list {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  > li {
    height: fit-content;
    padding: 2rem;
    border: 1px solid var(--grey);

    > h2 {
      text-align: center;
      font-size: 4rem;
      margin-bottom: 1.2rem;
      font-family: var(--title-font);
    }

    > .slug {
      text-align: center;
      margin-bottom: 1.2rem;
      font-family: monospace;
    }

    .body {
      :deep(*) {
        line-height: 1.6;
      }

      :deep(> :not(:last-child)) {
        margin-bottom: 1.2rem;
      }

      :deep(ul),
      :deep(ol) {
        padding-left: 4rem;
        > li:not(:last-child) {
          margin-bottom: 0.6rem;
        }
      }

      :deep(ul > li) {
        list-style-type: disc;
      }

      :deep(ol > li) {
        list-style-type: decimal;
      }

      :deep(blockquote) {
        border-left: 0.8rem solid var(--dark);
        padding-left: 2rem;
        margin-left: 0.8rem;
        font-size: 2rem;
      }
    }
  }
}
</style>
