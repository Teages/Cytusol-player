<template>
  <v-dialog
    v-model="display"
    hide-overlay
    max-width="400"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        rounded

        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        dense
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="display = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>CyShare</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text class="py-3 px-3" style="height: 120px;">
        <div v-if="token">
          <v-btn :disabled="shared" block rounded @click="uploadLevel">{{$t('share.share')}}</v-btn>
          <v-text-field
            ref="linkbox"
            :disabled="!shared || shareLink == ''"
            readonly
            class="m-5"
            v-model="shareLink"
            :loading="uploadProgress < 101"
            :color="this.copyed? 'green' : null"
            append-outer-icon="mdi-content-copy"
            @click:append-outer="copySharedUrl()"
          >
            <template v-slot:progress>
              <v-progress-linear
                v-if="uploadProgress < 101"
                :value="uploadProgress"
                absolute
                height="2"
              ></v-progress-linear>
            </template>
          </v-text-field>
        </div>
        <v-btn v-else rounded block 
          @click="openLoginUrl"
        >
          {{$t('share.login')}}
        </v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn v-if="token" text @click="cleanToken()">{{$t('share.logout')}}</v-btn>
          <v-spacer />
          <v-btn text @click="display = false">{{$t('close')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Axios from "axios";
export default {
  name: "CyShare",

  props: {
    levelBlob: {
      type: File,
      required: true,
    }
  },
  data () {
    return {
      display: false,
      shared: false,
      token: null,
      shareLink: '',
      uploadProgress: 101,
      cloudId: null,
      copyed: false,
    }
  },
  methods: {
    getToken() {
      if (localStorage.onedriveToken) {
        let obj = JSON.parse(localStorage.onedriveToken)
        if (obj) {
          this.token = obj.value
        }
      } else {
        this.token = null
      }
    },
    openLoginUrl() {
      const clientId = '94047eae-723e-43bd-ac33-b6353e98401f';
      const redirectUrl = `https://player.teages.xyz`;
      const scope = 'openid https://graph.microsoft.com/Files.ReadWrite.AppFolder';
      window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUrl}&scope=${scope}`)
    },
    cleanToken() {
      localStorage.onedriveToken = null
      this.token = null
    },
    uploadLevel() {
      const file = this.levelBlob
      const directory = 'SharedCytoidLevel';
      const filePath = `${directory}/${Date.now()}-${file.name}`;
      const token = this.token.access_token
      let uploadResponse;
      console.log(filePath);
      this.shared = true;
      (async()=>{
        await this.requestFolder(token)
        if (file.size > 4 * 1000 * 1000) {
          let uploadUrl = '';
          await Axios({
            method: 'POST',
            url: `https://graph.microsoft.com/v1.0/drive/special/approot:/${filePath}:/createUploadSession`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).then(response=>{
            uploadUrl = response.data.uploadUrl
          });
          uploadResponse = await this.uploadLarge(file, uploadUrl, file.size);
        } else {
          uploadResponse = await this.uploadSmall(file, filePath, token);
        }
        this.cloudId = uploadResponse.data.id;
        let shareData = await this.getSharedData(this.cloudId, token)
        this.shareLink = `https://player.teages.xyz/?shareId=${shareData.data.shareId}`
        this.uploadProgress = 101
      })();
    },
    requestFolder(token) {
      return Axios({
        method: 'Get',
        url: `https://graph.microsoft.com/v1.0/me/drive/special/approot:/`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    },
    uploadSmall(file, path, token) {
      this.uploadProgress = 0
      return Axios({
        method: 'PUT',
        url: `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${path}:/content`,
        data: file,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progress) => {
          this.uploadProgress = Math.round(progress.loaded / progress.total * 100)
        }
      });
    },
    uploadLarge(data, url, size) {
      this.uploadProgress = 0
      return Axios({
        method: 'PUT',
        url,
        data,
        headers: {
          'Content-Range': `bytes 0-${size - 1}/${size}`,
        },
        onUploadProgress: (progress) => {
          this.uploadProgress = Math.round(progress.loaded / progress.total * 100)
        }
      });
    },
    getUploadUrl(filePath, token) {
      return Axios({
        method: 'POST',
        url: `https://graph.microsoft.com/v1.0/drive/special/approot:/${filePath}:/createUploadSession`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    },
    getSharedData(cloudId, token) {
      return Axios({
        method: 'POST',
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${cloudId}/createLink`,
        data: {
          type: 'view',
          scope: 'anonymous',
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    },
    copySharedUrl() {
      const clipboardObj = navigator.clipboard;
      if (clipboardObj) {
        clipboardObj.writeText(this.shareLink)
          .then(()=>{
            this.copyed = true
            this.$refs.linkbox.focus()
            setTimeout(()=>{this.copyed = false}, 1000)
          })
      }
    }
  },
  mounted() {
    this.getToken()
    window.addEventListener('storage', (event) => {
      if (event.key && event.key == 'onedriveToken') {
        this.getToken()
      }
    })
  }

};
</script>
