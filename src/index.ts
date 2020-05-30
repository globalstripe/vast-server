import { VASTClient } from 'vast-client';
import { VAST } from  'vast-xml';
 

const getvastclient = async () => {

const vastClient = new VASTClient();

const data = await vastClient.get('https://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&url=&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&vad_type=linear&vpos=preroll&pod=1&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6256&video_doc_id=short_onecue&cmsid=496&kfa=0&tfcd=0');
console.log(data);

}


const generatevast = async () => {
const vast = new VAST();
console.log("NEW VAST Output");
console.log(vast);
}

getvastclient();
generatevast();
