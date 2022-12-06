typeof Craft.Formie=="undefined"&&(Craft.Formie={});Craft.Formie.SubmissionIndex=Craft.BaseElementIndex.extend({editableForms:null,$newSubmissionBtnGroup:null,$newSubmissionBtn:null,init(t,e,i){this.on("selectSource",$.proxy(this,"updateButton")),this.on("selectSite",$.proxy(this,"updateButton")),this.base(t,e,i),this.settings.criteria={isIncomplete:!1,isSpam:!1};var r=this.$statusMenuBtn.menubtn().data("menubtn");if(r){var a=$('<li><a data-incomplete><span class="icon" data-icon="draft"></span> '+Craft.t("formie","Incomplete")+"</a></li>"),n=$('<li><a data-spam><span class="icon" data-icon="error"></span> '+Craft.t("formie","Spam")+"</a></li>"),o=$('<hr class="padded">');r.menu.addOptions(a.children()),r.menu.addOptions(n.children()),o.appendTo(r.menu.$container.find("ul:first")),a.appendTo(r.menu.$container.find("ul:first")),n.appendTo(r.menu.$container.find("ul:first")),r.menu.on("optionselect",$.proxy(this,"_handleStatusChange"))}},afterInit(){this.editableForms=[];var{editableSubmissions:t}=Craft.Formie;if(t)for(var e=0;e<t.length;e++){var i=t[e];this.getSourceByKey("form:"+i.id)&&this.editableForms.push(i)}this.base()},_handleStatusChange(t){this.statusMenu.$options.removeClass("sel");var e=$(t.selectedOption).addClass("sel");this.$statusMenuBtn.html(e.html()),this.trashed=!1,this.drafts=!1,this.status=null,this.settings.criteria.isIncomplete=!1,this.settings.criteria.isSpam=!1;let i=null;Garnish.hasAttr(e,"data-spam")?(this.settings.criteria.isSpam=!0,i="spam"):Garnish.hasAttr(e,"data-incomplete")?(this.settings.criteria.isIncomplete=!0,i="incomplete"):Garnish.hasAttr(e,"data-trashed")?(this.trashed=!0,this.settings.criteria.isIncomplete=null,this.settings.criteria.isSpam=null,i="trashed"):Garnish.hasAttr(e,"data-drafts")?(this.drafts=!0,i="drafts"):this.status=e.data("status"),this.activeViewMenu&&this.activeViewMenu.updateSortField(),Craft.setQueryParam("status",i),this.updateElements()},getViewClass(t){return t==="table"?Craft.Formie.SubmissionTableView:this.base(t)},getDefaultSort(){return["dateCreated","desc"]},getDefaultSourceKey(){if(this.settings.context==="index"&&typeof defaultFormieFormHandle!="undefined")for(var t=0;t<this.$sources.length;t++){var e=$(this.$sources[t]);if(e.data("handle")===defaultFormieFormHandle)return e.data("key")}return this.base()},updateButton(){if(!!this.$source){var t=this.$source.data("handle"),e,i,r;if(this.editableForms.length){this.$newSubmissionBtnGroup&&this.$newSubmissionBtnGroup.remove();var a;if(t){for(e=0;e<this.editableForms.length;e++)if(this.editableForms[e].handle===t){a=this.editableForms[e];break}}this.$newSubmissionBtnGroup=$('<div class="btngroup submit"/>');var n;if(a?(i=this._getFormTriggerHref(a),r=this.settings.context==="index"?Craft.t("formie","New submission"):Craft.t("formie","New {form} submission",{form:a.name}),this.$newSubmissionBtn=$('<a class="btn submit add icon" '+i+' role="button" tabindex="0">'+Craft.escapeHtml(r)+"</a>").appendTo(this.$newSubmissionBtnGroup),this.settings.context!=="index"&&this.addListener(this.$newSubmissionBtn,"click",function(f){this._openCreateSubmissionModal(f.currentTarget.getAttribute("data-id"))}),this.editableForms.length>1&&(n=$("<button/>",{type:"button",class:"btn submit menubtn"}).appendTo(this.$newSubmissionBtnGroup))):this.$newSubmissionBtn=n=$("<button/>",{type:"button",class:"btn submit add icon menubtn",text:Craft.t("formie","New submission")}).appendTo(this.$newSubmissionBtnGroup),n){var o='<div class="menu"><ul>';for(e=0;e<this.editableForms.length;e++){var s=this.editableForms[e];(this.settings.context==="index"&&$.inArray(this.siteId,s.sites)!==-1||this.settings.context!=="index"&&s!==a)&&(i=this._getFormTriggerHref(s),r=this.settings.context==="index"?s.name:Craft.t("formie","New {form} submission",{form:s.name}),o+="<li><a "+i+">"+Craft.escapeHtml(r)+"</a></li>")}o+="</ul></div>",$(o).appendTo(this.$newSubmissionBtnGroup);var l=new Garnish.MenuBtn(n);this.settings.context!=="index"&&l.on("optionSelect",f=>{this._openCreateSubmissionModal(f.option.getAttribute("data-id"))})}this.addButton(this.$newSubmissionBtnGroup)}if(this.settings.context==="index"&&typeof history!="undefined"){var d="formie/submissions";t&&(d+="/"+t),history.replaceState({},"",Craft.getUrl(d))}}},getSite(){if(!!this.siteId)return Craft.sites.find(t=>t.id==this.siteId)},_getFormTriggerHref(t){if(this.settings.context==="index"){const e=`formie/submissions/${t.handle}/new`,i=this.getSite(),r=i?{site:i.handle}:void 0;return`href="${Craft.getUrl(e,r)}"`}return`data-id="${t.id}"`},_openCreateSubmissionModal(t){if(!this.$newSubmissionBtn.hasClass("loading")){for(var e,i=0;i<this.editableForms.length;i++)if(this.editableForms[i].id==t){e=this.editableForms[i];break}if(!!e){this.$newSubmissionBtn.addClass("inactive");var r=this.$newSubmissionBtn.text();this.$newSubmissionBtn.text(Craft.t("formie","New {form} submission",{form:e.name})),Craft.createElementEditor(this.elementType,{hudTrigger:this.$newSubmissionBtnGroup,siteId:this.siteId,attributes:{formId:t},onHideHud:()=>{this.$newSubmissionBtn.removeClass("inactive").text(r)},onSaveElement:a=>{var n="form:"+e.id;this.sourceKey!==n&&this.selectSourceByKey(n),this.selectElementAfterUpdate(a.id),this.updateElements()}})}}}});Craft.Formie.SubmissionTableView=Craft.TableElementIndexView.extend({startDate:null,endDate:null,startDatepicker:null,endDatepicker:null,$chartExplorer:null,$totalValue:null,$chartContainer:null,$spinner:null,$error:null,$chart:null,$startDate:null,$endDate:null,afterInit(){this.$explorerContainer=$('<div class="chart-explorer-container"></div>').prependTo(this.$container),this.createChartExplorer(),this.base()},getStorage(t){return Craft.Formie.SubmissionTableView.getStorage(this.elementIndex._namespace,t)},setStorage(t,e){Craft.Formie.SubmissionTableView.setStorage(this.elementIndex._namespace,t,e)},createChartExplorer(){var t=$('<div class="chart-explorer"></div>').appendTo(this.$explorerContainer),e=$('<div class="chart-header"></div>').appendTo(t),i=$('<div class="date-range" />').appendTo(e),r=$('<div class="datewrapper"></div>').appendTo(i);$('<span class="to light">to</span>').appendTo(i);var a=$('<div class="datewrapper"></div>').appendTo(i),n=$('<div class="total"></div>').appendTo(e);$('<div class="total-label light">'+Craft.t("formie","Total Submissions")+"</div>").appendTo(n);var o=$('<div class="total-value-wrapper"></div>').appendTo(n),s=$('<span class="total-value">&nbsp;</span>').appendTo(o);this.$chartExplorer=t,this.$totalValue=s,this.$chartContainer=$('<div class="chart-container"></div>').appendTo(t),this.$spinner=$('<div class="spinner hidden" />').prependTo(e),this.$error=$('<div class="error"></div>').appendTo(this.$chartContainer),this.$chart=$('<div class="chart"></div>').appendTo(this.$chartContainer),this.$startDate=$('<input type="text" class="text" size="20" autocomplete="off" />').appendTo(r),this.$endDate=$('<input type="text" class="text" size="20" autocomplete="off" />').appendTo(a),this.$startDate.datepicker($.extend({onSelect:$.proxy(this,"handleStartDateChange")},Craft.datepickerOptions)),this.$endDate.datepicker($.extend({onSelect:$.proxy(this,"handleEndDateChange")},Craft.datepickerOptions)),this.startDatepicker=this.$startDate.data("datepicker"),this.endDatepicker=this.$endDate.data("datepicker"),this.addListener(this.$startDate,"keyup","handleStartDateChange"),this.addListener(this.$endDate,"keyup","handleEndDateChange");var l=this.getStorage("startTime")||new Date().getTime()-60*60*24*7*1e3,d=this.getStorage("endTime")||new Date().getTime();this.setStartDate(new Date(l)),this.setEndDate(new Date(d)),this.loadReport()},handleStartDateChange(){this.setStartDate(Craft.Formie.SubmissionTableView.getDateFromDatepickerInstance(this.startDatepicker))&&this.loadReport()},handleEndDateChange(){this.setEndDate(Craft.Formie.SubmissionTableView.getDateFromDatepickerInstance(this.endDatepicker))&&this.loadReport()},setStartDate(t){return this.startDate&&t.getTime()===this.startDate.getTime()?!1:(this.startDate=t,this.setStorage("startTime",this.startDate.getTime()),this.$startDate.val(Craft.formatDate(this.startDate)),this.endDate&&this.startDate.getTime()>this.endDate.getTime()&&this.setEndDate(new Date(this.startDate.getTime())),!0)},setEndDate(t){return this.endDate&&t.getTime()===this.endDate.getTime()?!1:(this.endDate=t,this.setStorage("endTime",this.endDate.getTime()),this.$endDate.val(Craft.formatDate(this.endDate)),this.startDate&&this.endDate.getTime()<this.startDate.getTime()&&this.setStartDate(new Date(this.endDate.getTime())),!0)},loadReport(){var t=this.settings.params;t.startDate=Craft.Formie.SubmissionTableView.getDateValue(this.startDate),t.endDate=Craft.Formie.SubmissionTableView.getDateValue(this.endDate),this.$spinner.removeClass("hidden"),this.$error.addClass("hidden"),this.$chart.removeClass("error"),Craft.sendActionRequest("POST","formie/charts/get-submissions-data",{data:t}).then(e=>{this.chart||(this.chart=new Craft.charts.Area(this.$chart));var i=new Craft.charts.DataTable(e.data.dataTable),r={formatLocaleDefinition:e.data.formatLocaleDefinition,orientation:e.data.orientation,formats:e.data.formats,dataScale:e.data.scale};this.chart.draw(i,r),this.$totalValue.html(e.data.totalHtml)}).catch(({response:e})=>{var i=Craft.t("formie","An unknown error occurred.");e&&e.data&&e.data.message&&(i=e.data.message),this.$error.html(i),this.$error.removeClass("hidden"),this.$chart.addClass("error")}).finally(()=>{this.$spinner.addClass("hidden")})}},{storage:{},getStorage(t,e){return Craft.Formie.SubmissionTableView.storage[t]&&Craft.Formie.SubmissionTableView.storage[t][e]?Craft.Formie.SubmissionTableView.storage[t][e]:null},setStorage(t,e,i){typeof Craft.Formie.SubmissionTableView.storage[t]=="undefined"&&(Craft.Formie.SubmissionTableView.storage[t]={}),Craft.Formie.SubmissionTableView.storage[t][e]=i},getDateFromDatepickerInstance(t){return new Date(t.currentYear,t.currentMonth,t.currentDay)},getDateValue(t){return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()}});(function(t){t(document).on("click",".js-fui-submission-modal-send-btn",function(e){e.preventDefault(),new Craft.Formie.SendNotificationModal(t(this).data("id"))})})(jQuery);Craft.Formie.SendNotificationModal=Garnish.Modal.extend({init(t){this.$form=$('<form class="modal fui-send-notification-modal" method="post" accept-charset="UTF-8"/>').appendTo(Garnish.$bod),this.$body=$('<div class="body"><div class="spinner big"></div></div>').appendTo(this.$form);var e=$('<div class="footer"/>').appendTo(this.$form),i=$('<div class="buttons right"/>').appendTo(e);this.$cancelBtn=$('<input type="button" class="btn" value="'+Craft.t("formie","Cancel")+'"/>').appendTo(i),this.$updateBtn=$('<input type="button" class="btn submit" value="'+Craft.t("formie","Send Email Notification")+'"/>').appendTo(i),this.$footerSpinner=$('<div class="spinner right hidden"/>').appendTo(e),Craft.initUiElements(this.$form),this.addListener(this.$cancelBtn,"click","onFadeOut"),this.addListener(this.$updateBtn,"click","onSend"),this.base(this.$form);var r={id:t};Craft.sendActionRequest("POST","formie/submissions/get-send-notification-modal-content",{data:r}).then(a=>{this.$body.html(a.data.modalHtml),Craft.appendHeadHtml(a.data.headHtml),Craft.appendBodyHtml(a.data.footHtml)})},onFadeOut(){this.$form.remove(),this.$shade.remove()},onSend(t){t.preventDefault(),this.$footerSpinner.removeClass("hidden");var e=this.$form.serialize();Craft.sendActionRequest("POST","formie/submissions/send-notification",{data:e}).then(i=>{location.reload()}).catch(({response:i})=>{i&&i.data&&i.data.message?Craft.cp.displayError(i.data.message):Craft.cp.displayError()}).finally(()=>{this.$footerSpinner.addClass("hidden")})}});Craft.registerElementIndexClass("verbb\\formie\\elements\\Submission",Craft.Formie.SubmissionIndex);typeof Craft.Formie=="undefined"&&(Craft.Formie={});(function(t){t(document).on("click",".js-fui-notification-modal-resend-btn",function(e){e.preventDefault(),new Craft.Formie.ResendNotificationModal(t(this).data("id"))})})(jQuery);Craft.Formie.ResendNotificationModal=Garnish.Modal.extend({init(t){this.$form=$('<form class="modal fui-resend-modal" method="post" accept-charset="UTF-8"/>').appendTo(Garnish.$bod),this.$body=$('<div class="body"><div class="spinner big"></div></div>').appendTo(this.$form);var e=$('<div class="footer"/>').appendTo(this.$form),i=$('<div class="buttons right"/>').appendTo(e);this.$cancelBtn=$('<input type="button" class="btn" value="'+Craft.t("formie","Cancel")+'"/>').appendTo(i),this.$updateBtn=$('<input type="button" class="btn submit" value="'+Craft.t("formie","Resend Email Notification")+'"/>').appendTo(i),this.$footerSpinner=$('<div class="spinner right hidden"/>').appendTo(e),Craft.initUiElements(this.$form),this.addListener(this.$cancelBtn,"click","onFadeOut"),this.addListener(this.$updateBtn,"click","onResend"),this.base(this.$form);var r={id:t};Craft.sendActionRequest("POST","formie/sent-notifications/get-resend-modal-content",{data:r}).then(a=>{this.$body.html(a.data.modalHtml),Craft.appendHeadHtml(a.data.headHtml),Craft.appendBodyHtml(a.data.footHtml)})},onFadeOut(){this.$form.remove(),this.$shade.remove()},onResend(t){t.preventDefault(),this.$footerSpinner.removeClass("hidden");var e=this.$form.serialize();Craft.sendActionRequest("POST","formie/sent-notifications/resend",{data:e}).then(i=>{location.reload()}).catch(({response:i})=>{i&&i.data&&i.data.message?Craft.cp.displayError(i.data.message):Craft.cp.displayError()}).finally(()=>{this.$footerSpinner.addClass("hidden")})}});Craft.Formie.BulkResendElementAction=Garnish.Base.extend({init(t){new Craft.ElementActionTrigger({type:t,batch:!0,activate(e){new Craft.Formie.BulkResendModal(e.find(".element"),e)}})}});Craft.Formie.BulkResendModal=Garnish.Modal.extend({init(t,e){this.$element=t,this.$selectedItems=e;var i=e.length==1?"":"s",r="<strong>"+e.length+"</strong> notification"+i;this.$form=$('<form class="modal fitted" method="post" accept-charset="UTF-8"/>').appendTo(Garnish.$bod),this.$body=$('<div class="body" style="max-width: 560px;"><h2>'+Craft.t("formie","Bulk Resend Email Notification")+"</h2><p>"+Craft.t("formie","You are about to resend {desc}. You can resend each notification to their original recipients, or choose specific recipients.",{desc:r})+"</p></div>").appendTo(this.$form);var a=Craft.ui.createSelectField({label:Craft.t("formie","Recipients"),name:"recipientsType",options:[{label:Craft.t("formie","Original Recipients"),value:"original"},{label:Craft.t("formie","Custom Recipients"),value:"custom"}],toggle:!0,targetPrefix:"type-"}).appendTo(this.$body),n=$("<div/>",{id:"type-custom",class:"hidden"}).appendTo(this.$body);Craft.ui.createTextField({label:Craft.t("formie","Custom Recipients"),instructions:Craft.t("formie","Provide recipients for each email notification to be sent to. For multiple recipients, separate each with a comma."),name:"to",required:!0}).appendTo(n),this.$selectedItems.each((l,d)=>{$("<input/>",{type:"hidden",name:"ids[]",value:$(d).data("id")}).appendTo(this.$body)});var o=$('<div class="footer"/>').appendTo(this.$form),s=$('<div class="buttons right"/>').appendTo(o);this.$cancelBtn=$('<input type="button" class="btn" value="'+Craft.t("formie","Cancel")+'"/>').appendTo(s),this.$updateBtn=$('<input type="button" class="btn submit" value="'+Craft.t("formie","Resend Email Notifications")+'"/>').appendTo(s),this.$footerSpinner=$('<div class="spinner right hidden"/>').appendTo(o),this.addListener(this.$cancelBtn,"click","onFadeOut"),this.addListener(this.$updateBtn,"click","onResend"),this.addListener(a,"change","onSelectChange"),this.base(this.$form)},onSelectChange(){this.updateSizeAndPosition()},onFadeOut(){this.$form.remove(),this.$shade.remove()},onResend(t){t.preventDefault(),this.$footerSpinner.removeClass("hidden");var e=this.$form.serialize();Craft.sendActionRequest("POST","formie/sent-notifications/bulk-resend",{data:e}).then(i=>{location.reload()}).catch(({response:i})=>{i&&i.data&&i.data.message?Craft.cp.displayError(i.data.message):Craft.cp.displayError()}).finally(()=>{this.$footerSpinner.addClass("hidden")})}});typeof Craft.Formie=="undefined"&&(Craft.Formie={});(function(t){})(jQuery);
//# sourceMappingURL=formie-cp.js.map
