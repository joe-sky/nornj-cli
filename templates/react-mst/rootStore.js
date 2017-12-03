<#-template name="importStore">
import #{pageName | pascal}#Store from "./pages/#{pageName}#Store";
//{importStore}//
</#-template>

<#-template name="pageStore">
#{pageName}#: types.optional(#{pageName | pascal}#Store, {}),
  //{pageStore}//
</#-template>