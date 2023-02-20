const Host = {
    ROOT: "http://localhost:3000",
    PREFIX: "/v1/api",
    BACKEND: "http://localhost:3001",
  }
    
  const ApiEndpoints = {  
    UserEndpoints: {
      route: `/user`,
      register: `/register`,
      login: `/login`, 
      update: `/update`, 
      access: `/access`, 
      compare: '/compare',
      UserWentLive: '/user-went-live',
    },
  
    FacebookEndpoints: {
      route: `/facebook`,
      permalink: `/permalink`,
      remove: `/remove`,
      authorize: `/authorize`,    
      viewCount: `/viewCount`,
      broadcast: `/broadcast`,
      end: `/end`,
    },
  
    YoutubeEndpoints: { 
      route: `/youtube`,
      authorize: `/authorize`,
      refresh: `/refresh`,
      viewCount: `/viewCount`,
      broadcast: `/broadcast`,
      live: `/live`,
      end: `/end`,
     // update: `/update`,
      remove: `/remove`,
    },
  
    BroadcastEndpoints: {
      route: `/broadcast`,
      add: `/add`,
      get: `/get`,
    },
  
    DestinationEndpoints: {
      route: `/destination`,
     // update: `/update`,
      get: `/get`,
    },
  
   
  };
  
  module.exports = {ApiEndpoints , Host}