<template>
  <reg-visual
    v-if="data.value === 'reg-visual'"
    :data="data"
  />
  <json-formatter
    v-else-if="data.value === 'json-formatter'"
    :data="data"
  />
  <native-bookmark v-else-if="data.value === 'native-bookmark'" />
  <img-to-base
    v-else-if="data.value === 'img-to-base'"
    :data="data"
  />
  <public-bookmarks
    v-else-if="data.value === 'public-bookmarks'"
    :data="data"
  />
  <private-bookmarks
    v-else-if="data.value === 'private-bookmarks'"
    :data="data"
  />
  <span v-else>unknown widgets type<br>{{ data.name }} <small>{{ data.value }}</small></span>
</template>

<script lang="ts">
import { Bookmark } from '@database/entity/bookmark'
import RegVisual from './widgets/reg-visual/index.vue'
import JsonFormatter from './widgets/json-formatter/index.vue'
import NativeBookmark from './widgets/native-bookmark.vue'
import ImgToBase from './widgets/img-to-base/index.vue'
import PublicBookmarks from './widgets/public-bookmarks/index.vue'
import PrivateBookmarks from './widgets/private-bookmarks/index.vue'

export default {
  components: {
    RegVisual,
    JsonFormatter,
    NativeBookmark,
    ImgToBase,
    PublicBookmarks,
    PrivateBookmarks,
  },
  props: {
    data: {
      type: Bookmark,
      default() {
        return new Bookmark({})
      },
    },
  },
}
</script>
