<#-template name="importStore">
import #{pageName | capitalize}#Store from './pages/#{pageName}#Store';
//{importStore}//
</#-template>

<#-template name="pageStore">
#{pageName}#: types.optional(#{pageName | capitalize}#Store, {}),
  //{pageStore}//
</#-template>