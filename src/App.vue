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
  '60c88f73fa67d18524fc36c6be3793be35a65138c035a9697a0d940583301b96979da122e0b40cd4ff7aa614987d838093110189b9004feee2ee774777f7a297abf224fcf3ea558508ace922b83646d57f77b918a5a00c699b52eedfce31d7c5d897339155c9c9078f91131b910a77f51786a26ea30b3e3f1bfdfc1932e6c0b8';
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
    console.log(body);
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

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
