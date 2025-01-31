import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_view_home_page_info} from "../../../../../views/view_music/music_page/page_home/store/store_view_home_page_info";
import {Home_Lists_ApiWebService_of_ND} from "../../navidrome_api/services_web/page_lists/home_lists/index_service";
import {store_view_artist_page_info} from "../../../../../views/view_music/music_page/page_artist/store/store_view_artist_page_info"
import {store_view_album_page_info} from "../../../../../views/view_music/music_page/page_album/store/store_view_album_page_info";
import {Media_library_scanning_ApiService_of_ND} from "../../navidrome_api/services_normal/media_library_scanning/index_service";
import {store_view_media_page_info} from "../../../../../views/view_music/music_page/page_media/store/store_view_media_page_info";
import {Artist_Lists_ApiWebService_of_ND} from "../../navidrome_api/services_web/page_lists/artist_lists/index_service";
import {Album_Lists_ApiWebService_of_ND} from "../../navidrome_api/services_web/page_lists/album_lists/index_service";
import {Media_Lists_ApiWebService_of_ND} from "../services_web/page_lists/song_lists/index_service";
import {Playlists_ApiService_of_ND} from "../../navidrome_api/services_normal/playlists/index_service";
import {Album$Medias_Lists_ApiService_of_ND} from "../../navidrome_api/services_normal/album$songs_lists/index_service";
import {Browsing_ApiService_of_ND} from "../../navidrome_api/services_normal/browsing/index_service";
import {store_playlist_list_info} from "../../../../../views/view_music/music_components/player_list/store/store_playlist_list_info"
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_playlist_list_fetchData} from "../../../../../views/view_music/music_components/player_list/store/store_playlist_list_fetchData";
import {
    Media_Retrieval_ApiService_of_ND
} from "../../navidrome_api/services_normal/media_retrieval/index_service";
import {store_player_audio_logic} from "../../../../../views/view_music/music_page/page_player/store/store_player_audio_logic";
import {store_server_user_model} from "../../../../data_stores/server/store_server_user_model";
import {
    store_playlist_list_logic
} from "../../../../../views/view_music/music_components/player_list/store/store_playlist_list_logic";
import {store_player_audio_info} from "../../../../../views/view_music/music_page/page_player/store/store_player_audio_info";
import {Items_ApiService_of_Je} from "../services_web/Items/index_service";

import {Audio_ApiService_of_Je} from "../services_web/Audio/index_service";
import {Artists_ApiService_of_Je} from "../services_web/Artists/index_service";
import axios from "axios";
import {
    store_view_media_page_logic
} from "../../../../../views/view_music/music_page/page_media/store/store_view_media_page_logic";

export class Get_Jellyfin_Temp_Data_To_LocalSqlite{
    private audio_ApiService_of_Je = new Audio_ApiService_of_Je(
        store_server_users.server_config_of_current_user_of_sqlite?.url
    )
    private items_ApiService_of_Je = new Items_ApiService_of_Je(
        store_server_users.server_config_of_current_user_of_sqlite?.url
    )
    private artists_ApiService_of_Je = new Artists_ApiService_of_Je(
        store_server_users.server_config_of_current_user_of_sqlite?.url
    )

    private home_Lists_ApiWebService_of_ND = new Home_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url,
    )

    public async get_home_list(parentId: string){
        await this.get_home_list_of_maximum_playback(parentId)
        await this.get_home_list_of_random_search(parentId)
        await this.get_home_list_of_recently_added(parentId)
        await this.get_home_list_of_recently_played(parentId)
    }
    public async get_home_list_of_maximum_playback(parentId: string){
        const response_list_of_maximum_playback = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?SortBy=PlayCount&SortOrder=Descending&' +
            'IncludeItemTypes=Audio&Limit=16&Recursive=true&Fields=PrimaryImageAspectRatio' +
            '&Filters=IsPlayed' +
            '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&EnableTotalRecordCount=false' +
            '&api_key=' + store_server_user_model.authorization_of_Je
        );
        const maximum_playback  = response_list_of_maximum_playback.data.Items;
        if(maximum_playback != undefined && Array.isArray(maximum_playback)) {
            maximum_playback.map(async (album: any) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_home_page_info.home_Files_temporary_maximum_playback.push({
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            });
        }
    }
    public async get_home_list_of_random_search(parentId: string,){
        const list = await this.items_ApiService_of_Je.getItems_List(
            store_server_user_model.userid_of_Je, parentId, '',
            'Random', 'Descending',
            '18', '0',
            'Audio',
            'PrimaryImageAspectRatio', 'Primary%2CBackdrop%2CBanner%2CThumb', 'true', '1',
            '', 'IsPlayed'
        )
        const random_search  = list.Items;
        if(random_search != undefined && Array.isArray(random_search)) {
            random_search.map(async (album: any) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_home_page_info.home_Files_temporary_random_search.push({
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            });
        }
    }
    public async get_home_list_of_recently_added(parentId: string){
        const response_list_of_recently_added = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items/Latest?IncludeItemTypes=Audio&Limit=16&Fields=PrimaryImageAspectRatio' +
            '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&EnableTotalRecordCount=false' +
            '&api_key=' + store_server_user_model.authorization_of_Je
        );
        const recently_added  = response_list_of_recently_added.data;
        if(recently_added != undefined && Array.isArray(recently_added)) {
            recently_added.map(async (album: any) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_home_page_info.home_Files_temporary_recently_added.push({
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            });
        }
    }
    public async get_home_list_of_recently_played(parentId: string,){
        const response_list_of_recently_played = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?SortBy=DatePlayed&SortOrder=Descending&IncludeItemTypes=Audio&Limit=16&Fields=PrimaryImageAspectRatio' +
            '&Filters=IsPlayed' +
            '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&EnableTotalRecordCount=false' +
            '&api_key=' + store_server_user_model.authorization_of_Je
        );
        const recently_played  = response_list_of_recently_played.data.Items;
        if(recently_played != undefined && Array.isArray(recently_played)) {
            recently_played.map(async (album: any) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_home_page_info.home_Files_temporary_recently_played.push({
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            });
        }
    }

    public async get_media_list_of_artist(
        _artist_id: string,
        limit: string, startIndex: string,
    ){
        const response_media_list = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?ArtistIds=' +
            _artist_id + '&Filters=IsNotFolder&Recursive=true&SortBy=SortName&' +
            'Limit=' + limit + '&StartIndex=' + startIndex + '&' +
            'MediaTypes=Audio&SortOrder=Ascending&' +
            'Fields=Chapters%2CTrickplay&ExcludeLocationTypes=Virtual&' +
            'EnableTotalRecordCount=false&CollapseBoxSetItems=false&' +
            'api_key=' + store_server_user_model.authorization_of_Je
        );
        let songlist = response_media_list.data.Items;
        if (Array.isArray(songlist) && songlist.length > 0) {
            let last_index = store_view_media_page_info.media_Files_temporary.length
            store_view_media_page_info.media_File_metadata = [];
            await Promise.all(songlist.map(async (song: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                const blobUrl =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                    song.Id + '/universal?UserId=' +
                    store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                    store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                //
                store_view_media_page_info.media_File_metadata.push(song);
                store_view_media_page_info.media_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: song.UserData.IsFavorite,
                    rating: 0,
                    duration_txt: this.formatTime(song.RunTimeTicks),
                    id: song.Id,
                    title: song.Name,
                    path: blobUrl,
                    artist: song.Artists.length > 0 ? song.Artists[0] : '',
                    album: song.Album,
                    artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                    album_id: song.AlbumId,
                    album_artist: '',
                    has_cover_art: 0,
                    track_number: 0,
                    disc_number: 0,
                    year: song.ProductionYear,
                    size: '',
                    suffix: '',
                    duration: song.RunTimeTicks,
                    bit_rate: '',
                    genre: '',
                    compilation: 0,
                    created_at: song.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    order_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    sort_title: '',
                    disc_subtitle: '',
                    mbz_track_id: '',
                    mbz_album_id: '',
                    mbz_artist_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    lyrics: '',
                    bpm: 0,
                    channels: 0,
                    order_title: '',
                    mbz_release_track_id: '',
                    rg_album_gain: 0,
                    rg_album_peak: 0,
                    rg_track_gain: 0,
                    rg_track_peak: 0,
                    medium_image_url: medium_image_url
                });
            }));
        }
    }
    public async get_album_list_of_artist(
        _artist_id: string,
        limit: string, startIndex: string,
    ){
        const response_album_list = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?AlbumArtistIds=' +
            '46b1afb0b3217dfcabc2ad138e8011e9' + '&IncludeItemTypes=MusicAlbum&Recursive=true&' +
            'Fields=ParentId%2CPrimaryImageAspectRatio%2CParentId%2CPrimaryImageAspectRatio&' +
            'Limit=' + limit + '&StartIndex=' + startIndex + '&' +
            'CollapseBoxSetItems=false&' +
            'SortBy=PremiereDate%2CProductionYear%2CSortname&' +
            'api_key=' + store_server_user_model.authorization_of_Je
        );
        let albumlist = response_album_list.data.Items;
        store_view_album_page_info.album_item_count = response_album_list.data.TotalRecordCount
        if (Array.isArray(albumlist) && albumlist.length > 0) {
            let last_index = store_view_album_page_info.album_Files_temporary.length
            store_view_album_page_info.album_File_metadata = []
            albumlist.map(async (album: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_album_page_info.album_File_metadata.push(album)
                store_view_album_page_info.album_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            })
        }
    }

    public async get_media_list(
        playlist_id: string,
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        let songlist = []
        if(playlist_id === '') { // find_model
            const list = await this.items_ApiService_of_Je.getItems_List(
                userId, parentId, searchTerm,
                sortBy, sortOrder,
                limit, startIndex,
                includeItemTypes,
                fields, enableImageTypes, recursive, imageTypeLimit,
                years, filters
            )
            songlist = list.Items;
            store_view_media_page_info.media_item_count = list.TotalRecordCount
        }else{
            const response_playlMedias = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Playlists/' +
                playlist_id + '/Items?Fields=PrimaryImageAspectRatio&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&UserId=' +
                store_server_user_model.userid_of_Je + '&api_key=' +
                store_server_user_model.authorization_of_Je
            );
            songlist = Array.isArray(response_playlMedias.data.Items)
                ? response_playlMedias.data.Items
                : [];
            if(store_view_media_page_info.media_Files_temporary.length > 0 && songlist.length > 0){
                if(store_view_media_page_info.media_Files_temporary[0].id === songlist[0].Id){
                    songlist = []
                }
            }
        }
        if (Array.isArray(songlist) && songlist.length > 0) {
            if(sortBy === 'DatePlayed'){
                songlist = songlist.filter(song => song.UserData.PlayCount > 0)
            }
            let last_index = store_view_media_page_info.media_Files_temporary.length
            store_view_media_page_info.media_File_metadata = [];
            await Promise.all(songlist.map(async (song: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                const blobUrl =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                    song.Id + '/universal?UserId=' +
                    store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                    store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                //
                store_view_media_page_info.media_File_metadata.push(song);
                store_view_media_page_info.media_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: song.UserData.IsFavorite,
                    rating: 0,
                    duration_txt: this.formatTime(song.RunTimeTicks),
                    id: song.Id,
                    title: song.Name,
                    path: blobUrl,
                    artist: song.Artists.length > 0 ? song.Artists[0] : '',
                    album: song.Album,
                    artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                    album_id: song.AlbumId,
                    album_artist: '',
                    has_cover_art: 0,
                    track_number: 0,
                    disc_number: 0,
                    year: song.ProductionYear,
                    size: '',
                    suffix: '',
                    duration: song.RunTimeTicks,
                    bit_rate: '',
                    genre: '',
                    compilation: 0,
                    created_at: song.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    order_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    sort_title: '',
                    disc_subtitle: '',
                    mbz_track_id: '',
                    mbz_album_id: '',
                    mbz_artist_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    lyrics: '',
                    bpm: 0,
                    channels: 0,
                    order_title: '',
                    mbz_release_track_id: '',
                    rg_album_gain: 0,
                    rg_album_peak: 0,
                    rg_track_gain: 0,
                    rg_track_peak: 0,
                    medium_image_url: medium_image_url
                });
            }));
        }
    }
    public async get_album_list(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        const list = await this.items_ApiService_of_Je.getItems_List(
            userId, parentId, searchTerm,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, enableImageTypes, recursive, imageTypeLimit,
            years, filters
        )
        let albumlist = list.Items;
        store_view_album_page_info.album_item_count = list.TotalRecordCount
        if (Array.isArray(albumlist) && albumlist.length > 0) {
            if(sortBy === 'DatePlayed'){
                albumlist = albumlist.filter(album => album.UserData.PlayCount > 0)
            }
            let last_index = store_view_album_page_info.album_Files_temporary.length
            store_view_album_page_info.album_File_metadata = []
            albumlist.map(async (album: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_album_page_info.album_File_metadata.push(album)
                store_view_album_page_info.album_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            })
        }
    }
    public async get_album_list_find_artist_id(
        userId: string, albumArtistIds: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, recursive: string,
        collapseBoxSetItems: string
    ){
        const list = await this.items_ApiService_of_Je.getItems_List_Find_Artist_ALL_Album(
            userId, albumArtistIds,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, recursive,
            collapseBoxSetItems
        )
        let albumlist = list.Items;
        store_view_album_page_info.album_item_count = list.TotalRecordCount
        if (Array.isArray(albumlist) && albumlist.length > 0) {
            if(sortBy === 'DatePlayed'){
                albumlist = albumlist.filter(album => album.UserData.PlayCount > 0)
            }
            let last_index = store_view_album_page_info.album_Files_temporary.length
            store_view_album_page_info.album_File_metadata = []
            albumlist.map(async (album: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_album_page_info.album_File_metadata.push(album)
                store_view_album_page_info.album_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: album.UserData.IsFavorite,
                    rating: 0,
                    id: album.Id,
                    name: album.Name,
                    artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                    embed_art_path: '',
                    artist: album.Artists.length > 0 ? album.Artists[0] : '',
                    album_artist: '',
                    min_year: album.ProductionYear,
                    max_year: album.ProductionYear,
                    compilation: 0,
                    song_count: '',
                    duration: album.RunTimeTicks,
                    genre: '',
                    created_at: album.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    size: 0,
                    mbz_album_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    all_artist_ids: '',
                    image_files: '',
                    paths: '',
                    description: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    external_url: '',
                    external_info_updated_at: ''
                })
            })
        }
    }
    public async get_artist_list(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        const list = await this.artists_ApiService_of_Je.getAlbumArtists_ALL(
            userId, parentId, searchTerm,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, enableImageTypes, recursive, imageTypeLimit,
            years, filters
        )
        let artistlist = list.Items;
        store_view_artist_page_info.artist_item_count = list.TotalRecordCount
        if (Array.isArray(artistlist) && artistlist.length > 0) {
            if(sortBy === 'DatePlayed'){
                artistlist = artistlist.filter(artist => artist.UserData.PlayCount > 0)
            }
            let last_index = store_view_artist_page_info.artist_Files_temporary.length
            store_view_artist_page_info.artist_File_metadata = [];
            artistlist.map(async (artist: any, index: number) => {
                const medium_image_url =
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                    artist.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                store_view_artist_page_info.artist_File_metadata.push(artist)
                store_view_artist_page_info.artist_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: artist.UserData.IsFavorite,
                    rating: 0,
                    id: artist.Id,
                    name: artist.Name,
                    album_count: '',
                    full_text: '',
                    order_artist_name: '',
                    sort_artist_name: '',
                    song_count: '',
                    size: 0,
                    mbz_artist_id: '',
                    biography: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    similar_artists: '',
                    external_url: '',
                    external_info_updated_at: '',
                })
            })
        }
    }

    public async get_play_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
        playlist_id: string,
        _album_id:string, _artist_id:string
    ){
        let songlist = []
        if(playlist_id === '') {
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getMediaList_ALL(
                _end, _order, _sort, _start, _search, _starred, _album_id, _artist_id
            );
            songlist = data
        }else{
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getMediaList_of_Playlist(
                playlist_id,
                _end, _order, _sort, _start
            )
            songlist = data
        }
        if (Array.isArray(songlist) && songlist.length > 0) {
            if(_sort === 'playDate'){
                songlist = songlist.filter(song => song.playCount > 0)
            }
            let last_index = store_view_media_page_info.media_Files_temporary.length
            songlist.map(async (song: any, index: number) => {
                let lyrics = this.convertToLRC(song.lyrics)
                if(playlist_id !== '') {
                    song.id = song.mediaFileId
                }
                const new_song = {
                    absoluteIndex: index + 1 + last_index,
                    favorite: song.UserData.IsFavorite,
                    rating: 0,
                    duration_txt: this.formatTime(song.duration),
                    id: song.Id,
                    title: song.title,
                    path: url + '/stream?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.Id,
                    artist: song.artist,
                    album: song.album,
                    artist_id: song.artistId,
                    album_id: song.albumId,
                    album_artist: '',
                    has_cover_art: 0,
                    track_number: song.track,
                    disc_number: 0,
                    year: song.ProductionYear,
                    size: song.size,
                    suffix: song.suffix,
                    duration: song.RunTimeTicks,
                    bit_rate: song.bitRate,
                    genre: '',
                    compilation: 0,
                    created_at: song.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    order_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    sort_title: '',
                    disc_subtitle: '',
                    mbz_track_id: '',
                    mbz_album_id: '',
                    mbz_artist_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    lyrics: lyrics,
                    bpm: 0,
                    channels: 0,
                    order_title: '',
                    mbz_release_track_id: '',
                    rg_album_gain: 0,
                    rg_album_peak: 0,
                    rg_track_gain: 0,
                    rg_track_peak: 0,
                    medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.id
                }
                store_playlist_list_info.playlist_MediaFiles_temporary.push({
                    ...new_song,
                    play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                });
            })
            store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
            store_app_configs_logic_save.save_system_playlist_item_id_config();
        }
    }
    public async get_random_song_list(
        url: string,
        username: string,token: string,salt: string,
        size: string,
        fromYear: string, toYear: string
    ){
        let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
        const getRandomSongs = await browsing_ApiService_of_ND.getRandomSongs(
            username, token, salt,
            size,
            fromYear, toYear
        );
        let media_Retrieval_ApiService_of_ND = new Media_Retrieval_ApiService_of_ND(url);
        let songlist = getRandomSongs["subsonic-response"]["randomSongs"]["song"];
        if (Array.isArray(songlist) && songlist.length > 0) {
            let last_index = 0
            songlist.map(async (song: any, index: number) => {
                const getLyrics_all = await media_Retrieval_ApiService_of_ND.getLyrics_all(username, token, salt, song.id);
                let lyrics = undefined;
                try {
                    lyrics = this.convertToLRC_Array(getLyrics_all["subsonic-response"]["lyricsList"]["structuredLyrics"][0]["line"]);
                } catch {
                }
                const new_song = {
                    absoluteIndex: index + 1 + last_index,
                    favorite: song.UserData.IsFavorite,
                    rating: 0,
                    duration_txt: this.formatTime(song.duration),
                    id: song.Id,
                    title: song.title,
                    path: url + '/stream?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.Id,
                    artist: song.artist,
                    album: song.album,
                    artist_id: song.artistId,
                    album_id: song.albumId,
                    album_artist: '',
                    has_cover_art: 0,
                    track_number: song.track,
                    disc_number: 0,
                    year: song.ProductionYear,
                    size: song.size,
                    suffix: song.suffix,
                    duration: song.RunTimeTicks,
                    bit_rate: song.bitRate,
                    genre: '',
                    compilation: 0,
                    created_at: song.PremiereDate,
                    updated_at: '',
                    full_text: '',
                    album_artist_id: '',
                    order_album_name: '',
                    order_album_artist_name: '',
                    order_artist_name: '',
                    sort_album_name: '',
                    sort_artist_name: '',
                    sort_album_artist_name: '',
                    sort_title: '',
                    disc_subtitle: '',
                    mbz_track_id: '',
                    mbz_album_id: '',
                    mbz_artist_id: '',
                    mbz_album_artist_id: '',
                    mbz_album_type: '',
                    mbz_album_comment: '',
                    catalog_num: '',
                    comment: '',
                    lyrics: lyrics,
                    bpm: 0,
                    channels: 0,
                    order_title: '',
                    mbz_release_track_id: '',
                    rg_album_gain: 0,
                    rg_album_peak: 0,
                    rg_track_gain: 0,
                    rg_track_peak: 0,
                    medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.id
                }
                store_playlist_list_info.playlist_MediaFiles_temporary.push({
                    ...new_song,
                    play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                });
                if(index === songlist.length - 1){
                    const index = store_server_user_model.random_play_model_add
                        ? store_playlist_list_info.playlist_MediaFiles_temporary.length - 10: 0
                    const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
                    await store_player_audio_logic.update_current_media_info(media_file, index)
                    store_playlist_list_logic.media_page_handleItemDbClick = false
                    store_player_audio_info.this_audio_restart_play = true

                    store_server_user_model.random_play_model_add = false
                }
            })
            store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
            store_app_configs_logic_save.save_system_playlist_item_id_config();
        }
    }

    private formatTime(timestamp: number): string {
        const milliseconds = Math.floor(timestamp / 10000);
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    private convertToLRC(lyrics: string): string {
        let lrcLines: string[] = [];

        let lyricsArray;
        try {
            lyricsArray = JSON.parse(lyrics);
        } catch {
            try {
                return lyrics;
            } catch (e) {
                console.error("Failed to parse lyrics JSON:", e);
            }
            return '';
        }

        if (!Array.isArray(lyricsArray)) {
            return '';
        }

        for (const langBlock of lyricsArray) {
            if (langBlock.synced && Array.isArray(langBlock.line)) {
                for (const line of langBlock.line) {
                    const minutes = Math.floor(line.start / 60000);
                    const seconds = Math.floor((line.start % 60000) / 1000);
                    const milliseconds = (line.start % 1000).toString().padStart(3, '0').slice(0, 2);

                    const timeTag = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}]`;
                    lrcLines.push(`${timeTag}${line.value}`);
                }
            }
        }

        return lrcLines.join('\n');
    }
    private convertToLRC_Array(lyrics: {
        Text: string;
        Start: number;
    }[]): string {
        const SCALE_FACTOR = 0.0000001;
        const lrcLines = lyrics
            .map((item) => {
                const totalSeconds = item.Start * SCALE_FACTOR;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = Math.floor(totalSeconds % 60);
                const centiseconds = Math.floor((totalSeconds * 100) % 100);
                const time = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`;
                return `${time}${item.Text}`;
            })
            .join('\n');
        return `${lrcLines}`;
    }

    /// file count
    public async get_count_of_media_file(){
        try{
            const list_audio = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                '2CSortName', 'Descending',
                '1', 0,
                'Audio',
                'PrimaryImageAspectRatio', 'Primary', 'true', '1',
                '', ''
            )
            store_view_media_page_info.media_starred_count = list_audio.TotalRecordCount
            store_view_media_page_info.media_item_count = list_audio.TotalRecordCount
        }catch{}
    }
    public async get_count_of_artist_album(){
        try{
            //
            const list_album = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                '2CSortName', 'Descending',
                '1', 0,
                'MusicAlbum',
                'PrimaryImageAspectRatio', 'Primary', 'true', '1',
                '', ''
            )
            store_view_album_page_info.album_item_count = list_album.TotalRecordCount
            //
            const list_artist = await this.artists_ApiService_of_Je.getArtists_List_Quick(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music,
                'Artist', 'true'
            )
            store_view_artist_page_info.artist_item_count = list_artist.TotalRecordCount
        }catch{}
    }
    /// starred count
    public async get_count_of_starred(){
        try{
            const list_audio = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                '2CSortName', 'Descending',
                '1', 0,
                'Audio',
                'PrimaryImageAspectRatio', 'Primary', 'true', '1',
                '', 'IsFavorite'
            )
            store_view_media_page_info.media_starred_count = list_audio.TotalRecordCount
            //
            const list_album = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                '2CSortName', 'Descending',
                '1', 0,
                'MusicAlbum',
                'PrimaryImageAspectRatio', 'Primary', 'true', '1',
                '', 'IsFavorite'
            )
            store_view_album_page_info.album_starred_count = list_album.TotalRecordCount
            //
            const list_artist = await this.artists_ApiService_of_Je.getArtists_List_Quick_Filters(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music,
                'IsFavorite'
            )
            store_view_artist_page_info.artist_starred_count = list_artist.TotalRecordCount
        }catch{}
    }
    /// playlist count
    public async get_count_of_playlist(){
        try{
            const response = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?IncludeItemTypes=Playlist&Recursive=true&api_key=' +
                store_server_user_model.authorization_of_Je
            );
            store_view_media_page_info.media_playlist_count = response.data.TotalRecordCount
        }catch{}
    }

    public async get_playlist_je(){
        const response_playlists = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?IncludeItemTypes=Playlist&Recursive=true&api_key=' +
            store_server_user_model.authorization_of_Je
        );
        const playlists = response_playlists.data.Items;
        store_playlist_list_info.playlist_names_ALLLists = [];
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = [];
        if (playlists != null) {
            for (const playlist of playlists) {
                let playlist_tracks = []
                const response_playlMedias = await axios(
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Playlists/' +
                    playlist.Id + '/Items?Fields=PrimaryImageAspectRatio&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&UserId=' +
                    store_server_user_model.userid_of_Je + '&api_key=' +
                    store_server_user_model.authorization_of_Je
                );
                const playlMedias = Array.isArray(response_playlMedias.data.Items)
                    ? response_playlMedias.data.Items
                    : [];
                for (const song of playlMedias) {
                    const sqlite_song = {
                        id: playlist.Id,
                        playlist_id: playlist.Id,
                        media_file_id: song.Id
                    };
                    playlist_tracks.push(sqlite_song);
                }
                store_playlist_list_info.playlist_names_ALLLists.push({
                    label: playlist.Name,
                    value: playlist.Id
                })
                store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                    playlist: {
                        label: playlist.Name,
                        value: playlist.Id,
                        id: playlist.Id,
                        name: playlist.Name,
                        comment: '',
                        duration: playlist.RunTimeTicks || 0,
                        song_count: playlist.ChildCount || 0,
                        public: 0,
                        created_at: '',
                        updated_at: '',
                        path: '',
                        sync: 0,
                        size: 0,
                        rules: null,
                        evaluated_at: '',
                        owner_id: store_server_user_model.username,
                    },
                    playlist_tracks: playlist_tracks
                });
                const isDuplicate = store_view_media_page_logic.page_songlists.some(
                    (item: Play_List) => item.id === playlist.Id
                );
                if (!isDuplicate) {
                    const temp_playlist: Play_List = {
                        label: playlist.Name,
                        value: playlist.Id,
                        id: playlist.Id,
                        name: playlist.Name,
                        comment: '',
                        duration: playlist.RunTimeTicks,
                        song_count: playlist.ChildCount + ' *',
                        public: '',
                        created_at: '',
                        updated_at: '',
                        path: '',
                        sync: '',
                        size: '',
                        rules: '',
                        evaluated_at: '',
                        owner_id: store_server_user_model.userid_of_Je,
                    };
                    store_view_media_page_logic.page_songlists_options.push(temp_playlist);
                    store_view_media_page_logic.page_songlists.push(temp_playlist);
                }
            }
        }
    }

    /// recently count
    public async get_count_of_recently_media(
        url: string,
        username: string,token: string,salt: string
    ){
        store_view_media_page_info.media_recently_count = 0
    }
    public async get_count_of_recently_album(
        url: string,
        username: string,token: string,salt: string
    ){
        store_view_album_page_info.album_recently_count = 0
    }
    public async get_count_of_recently_artist(
        url: string,
        username: string,token: string,salt: string
    ){
        store_view_artist_page_info.artist_recently_count = 0
    }
}