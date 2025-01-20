<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import ServerListItem from '../ListItemComponents/ServerListItem.vue'
import { HandlePromisseError } from '@/utils/utils'

const serveActive = ref(false)
const filesFetched = ref([])
const fileIs4d = ref(false)

const requestHandshake = () => {
  axios
    .get('http://localhost:8000/handshake')
    .then((res) => {
      if (res.data.status === 'OK') {
        serveActive.value = true
      } else {
        serveActive.value = false
      }
    })
    .catch((error) => {
      HandlePromisseError(error)
      return Promise.reject(error)
    })
}

const requestFileList = () => {
  axios
    .get('http://localhost:8000/listFiles')
    .then((res) => {
      filesFetched.value = res.data.files
    })
    .catch((error) => {
      HandlePromisseError(error)
      return Promise.reject(error)
    })
}

const handleIs4dChange = (e: Event) => {
  fileIs4d.value = (e.target as HTMLInputElement).checked
}
</script>

<template>
  <div class="serveTabContainer">
    <h3>Serve</h3>
    <hr />
    <div>
      <button
        @click="
          (e) => {
            requestHandshake()
          }
        "
      >
        Check Server Status
      </button>
      <div :class="'serverStatus ' + (serveActive ? 'active' : '')"></div>
    </div>

    <div>
      <div class="listContainer">
        <ServerListItem
          class="fileItem"
          @click="$emit('serverAction', { type: 'loadFile', file: file, is4D: fileIs4d })"
          v-for="file in filesFetched"
          :key="file"
          :name="file"
        />
      </div>
      <div class="is4dCheck">
        <input type="checkbox" @change="handleIs4dChange($event)" />
        <label>Is 4D volume</label>
      </div>
      <button
        @click="
          (e) => {
            requestFileList()
          }
        "
      >
        Request File List
      </button>
    </div>
  </div>
</template>

<style scoped>
.serveTabContainer {
  width: 100%;
  height: 100%;
  border-left-style: solid;
  border-color: gray;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.serverStatus {
  width: 100%;
  height: 0.3rem;
  background-color: red;
  margin-top: 0.2rem;

  &.active {
    background-color: green;
  }
}

.listContainer {
  display: flex;
  flex-direction: column;
  height: 20rem;
  margin-top: 0.8rem;
  background-color: var(--button-text-disabled);
  overflow-y: auto;
}

.listItem:active {
  transform: scale(0.95);
  transition: transform 100ms linear;
}

.listItem:hover {
  cursor: pointer;
  border-color: var(--button-bg-hover);
  transition: border-color 200ms linear;
}

.is4dCheck {
  label {
    margin-left: 0.25rem;
  }
}
</style>
