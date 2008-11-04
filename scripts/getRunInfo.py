#!/usr/bin/env python

#
# $Id$
#

## CMSSW/DQM/SiStripMonitorClient/scripts/getRunInfo.py
#
#  For a given run, this script collects information useful for SiStrip DQM
#  from web sources.
#  Questions and comments to: volker.adler@cern.ch


import sys
import os
import string
import urllib
import time
import datetime
import getpass

# Constants

# numbers
TD_shiftUTC = datetime.timedelta(hours = 2) # positive for timezones with later time than UTC
INT_offset  = 8
# strings
STR_p5           = 'cmsusr0.cern.ch'
STR_SiStrip      = 'SIST'
STR_wwwDBSData   = 'https://cmsweb.cern.ch/dbs_discovery/getData'
LSTR_dbsInstances = ['cms_dbs_prod_global'    ,
                     'cms_dbs_caf_analysis_01']
STR_headDatasets = 'datasets'
STR_headFiles    = 'available data files'
DICT_htmlTags    = {}
DICT_htmlTags['GLOBAL_NAME']     = 'global name                  '
DICT_htmlTags['STATUS']          = 'status                       '
DICT_htmlTags['IN_DBS']          = 'in DBS                       '
DICT_htmlTags['SUBSYSTEMS']      = 'subsystems                   '
DICT_htmlTags['EVENTS']          = '# of triggers                '
DICT_htmlTags['START_TIME']      = 'start time (local)           '
DICT_htmlTags['END_TIME']        = 'end time (local)             '
DICT_htmlTags['L1KEY']           = 'L1 key                       '
DICT_htmlTags['HLTKEY']          = 'HLT key                      '
DICT_htmlTags['L1SOURCES']       = 'L1 sources                   '
DICT_htmlTags['RUN_RATE']        = 'event rate (Hz)              '
DICT_htmlTags['STOP_REASON']     = 'stop reason                  '
DICT_htmlTags['SHIFTER']         = 'DQM shifter                  '
DICT_htmlTags['CREATE_USER']     = 'entry created by             '
DICT_htmlTags['CREATE_TIME']     = 'entry creation time          '
DICT_htmlTags['ONLINE_COMMENT']  = 'DQM online shifter\'s comment '
DICT_htmlTags['OFFLINE_COMMENT'] = 'DQM offline shifter\'s comment'

# Globals

global Str_passwd
global Str_userID
global Str_run
global Dict_runRegistry
global DictDict_dbsDatasets
global DictDict_dbsEvents
global Dict_dbsDatasets
global Dict_maxLenDbsDatasets
# initialise
Str_run                = sys.argv[1]
Dict_runRegistry = {}
DictDict_dbsDatasets   = {}
DictDict_dbsEvents     = {}
Dict_dbsDatasets       = {}
Dict_maxLenDbsDatasets = {}

## FUNCTIONS

## Func_GetHtmlTags(str_text)
#
# Gets HTML tags from a string
def Func_GetHtmlTags(str_text):
  """  Func_GetHtmlTags(str_text):
  Gets HTML tags from a string
  """
  dict_tags  = {}
  # first look for tags w/ values
  lstr_split = str_text.split('</')
  for str_split in lstr_split[1:]:
    str_key            = str_split.split('>')[0]
    dict_tags[str_key] = str_key in dict_tags
  # second look for tags w/o values
  lstr_split = str_text.split('/>')
  for str_split in lstr_split[:-1]:
    str_key            = str_split.split('<')[-1].split()[0]
    dict_tags[str_key] = str_key in dict_tags
  return dict_tags
 
## Func_GetHtmlTagValue(str_tag, str_text)
#
# Gets the value of the n-th oocurence a given HTML tag from a string
def Func_GetHtmlTagValue(str_tag, str_text, int_index = 1):
  """  Func_GetHtmlTagValue(str_tag, str_text):
   Gets the value of the n-th oocurence a given HTML tag from a string
  """
  if int_index > str_text.count('<'+str_tag):
    return ''
  str_1 = str_text.split('<'+str_tag)[int_index]
  if str_1[0] != '>':
    if str_1.split('>')[0][-1] == '/':
      return ''
  return str_1.split('>',1)[1].split('</'+str_tag+'>')[0]

## Func_GetHtmlTagValues(str_text)
#
# Gets HTML tag values from a string
def Func_GetHtmlTagValues(str_text):
  """  Func_GetHtmlTagValues(str_text):
  Gets HTML tag values from a string
  """
  lstr_split   = str_text.split('</')
  lstr_values  = []
  for str_split in lstr_split[:-1]:
    lstr_values.append(str_split.split('>')[-1])
  return lstr_values
 
## Func_GetHtmlTagValueAttr(str_tag, str_text)
#
# Gets the (last) attribute of a given HTML tag value from a string
def Func_GetHtmlTagValueAttr(str_value, str_text):
  """  Func_GetHtmlTagValueAttr(str_value, str_text):
  Gets the (last) attributes of a given HTML tag value from a string
  """
  return str_text.split('\">'+str_value+'<')[0].split('=\"')[-1]
  
## Func_FillInfoRunRegistry()
#    
# Retrieves run info from RunRegistry and fills it into containers
def Func_FillInfoRunRegistry():
  """ Func_FillInfoRunRegistry():
  Retrieves run info from RunRegistry and fills it into containers
  """  
  str_runRegistry     = urllib.urlencode({'format':'xml', 'intpl':'xml', 'qtype':'RUN_NUMBER', 'sortname':'RUN_NUMBER'})
  file_runRegistry    = urllib.urlopen("http://pccmsdqm04.cern.ch/runregistry/runregisterdata", str_runRegistry)
  str_runRegistryLong = ''
  for str_runRegistry in file_runRegistry.readlines():
    str_runRegistryLong += str_runRegistry.splitlines()[0]
  bool_foundRun = False
  str_cmsmonRun = ''
  for int_runIndex in range(1,int(str_runRegistryLong.split('<RUNS')[1].split('>')[0].split('total=\"')[1].split('\"')[0])):
    str_cmsmonRun = Func_GetHtmlTagValue('RUN', str_runRegistryLong, int_runIndex)
    if Func_GetHtmlTagValue('NUMBER', str_cmsmonRun) == Str_run:
      bool_foundRun = True
      break
  if not bool_foundRun:
    print '> getRunInfo.py > run ' + Str_run + ' not found in run registry'
    return False
  dict_cmsmonHtmlTags = Func_GetHtmlTags(str_cmsmonRun)
  for str_cmsmonHtmlTag in dict_cmsmonHtmlTags.keys():
    if dict_cmsmonHtmlTags[str_cmsmonHtmlTag] == False:
      Dict_runRegistry[str_cmsmonHtmlTag] = Func_GetHtmlTagValue(str_cmsmonHtmlTag, str_cmsmonRun)
  if Dict_runRegistry['SUBSYSTEMS'].find(STR_SiStrip) < 0:
    print '> getRunInfo.py > SiStrip was not in this run'
    return False
  return True
  
## Func_FillInfoDBS(str_dbsInstance)
#
# Retrieves run info from DBS and fills it into containers
def Func_FillInfoDBS(str_dbsInstance):
  """ Func_FillInfoDBS(str_dbsInstance)
  Retrieves run info from DBS and fills it into containers
  """
  str_dbsRuns      = urllib.urlencode({'ajax':'0', '_idx':'0', 'pagerStep':'0', 'userMode':'user', 'release':'Any', 'tier':'Any', 'dbsInst':str_dbsInstance, 'primType':'Any', 'primD':'Any', 'minRun':Str_run, 'maxRun':Str_run})
  file_dbsRuns     = urllib.urlopen("https://cmsweb.cern.ch/dbs_discovery/getRunsFromRange", str_dbsRuns)
  lstr_dbsRuns     = []
  lstr_dbsDatasets = []
  dict_dbsDatasets = {}
  dict_dbsEvents   = {}
  for str_dbsRuns in file_dbsRuns.readlines():
    lstr_dbsRuns.append(str_dbsRuns)
    if str_dbsRuns.find(STR_wwwDBSData) >= 0:
      if str_dbsRuns.split('&amp;proc=')[1].find('&amp;') >= 0:
        lstr_dbsDatasets.append(str_dbsRuns.split('&amp;proc=')[1].split('&amp;')[0])
      else:
        lstr_dbsDatasets.append(str_dbsRuns.split('&amp;proc=')[1])
  int_maxLenDbsDatasets = 0
  for str_dbsDataset in lstr_dbsDatasets:
    str_dbsLFN  = urllib.urlencode({'dbsInst':str_dbsInstance, 'blockName':'*', 'dataset':str_dbsDataset, 'userMode':'user', 'run':Str_run})
    file_dbsLFN = urllib.urlopen("https://cmsweb.cern.ch/dbs_discovery/getLFNlist", str_dbsLFN)
    lstr_dbsLFN = []
    int_events  = 0
    for str_dbsLFN in file_dbsLFN.readlines():
      lstr_dbsLFN.append(str_dbsLFN)
      if str_dbsLFN.find('contians') >= 0 and str_dbsLFN.find('file(s)'): # FIXME: be careful, this typo might be corrected sometimes on the web page...
        dict_dbsDatasets[str_dbsDataset] = str_dbsLFN.split()[1]
      if str_dbsLFN.startswith('/store/data/'):
        int_events += int(Func_GetHtmlTagValue('td' ,lstr_dbsLFN[len(lstr_dbsLFN)-4]))
    dict_dbsEvents[str_dbsDataset] = str(int_events)
    if len(str_dbsDataset) > int_maxLenDbsDatasets:
      int_maxLenDbsDatasets = len(str_dbsDataset)
  DictDict_dbsDatasets[str_dbsInstance]   = dict_dbsDatasets
  DictDict_dbsEvents[str_dbsInstance]     = dict_dbsEvents
  Dict_dbsDatasets[str_dbsInstance]       = lstr_dbsDatasets
  Dict_maxLenDbsDatasets[str_dbsInstance] = int_maxLenDbsDatasets
 
## MAIN PROGRAM

print
print '> getRunInfo.py > information on run \t*** %s ***' %(Str_run)
print

# Enter online password

Str_userID = getpass.getuser()
Str_passwd = getpass.getpass('> getRunInfo.py > '+Str_userID+'@'+STR_p5+'\'s password: ')

# Get run information from the web

# get run RunRegistry entries
bool_runRegistry = Func_FillInfoRunRegistry()

# # print run RunRegistry info
# if bool_runRegistry:
#   print
#   print '> getRunInfo.py > * information from run registry *'
#   print
#   for str_htmlTag in DICT_htmlTags.keys():
#     if str_htmlTag in Dict_runRegistry:
#       print '> getRunInfo.py > %s: %s'    %(DICT_htmlTags[str_htmlTag],Dict_runRegistry[str_htmlTag])
  
# get run RunSummary entries
print 'DEBUG run summary'
pid_runSummary, fd_runSummary = os.forkpty()
if pid_runSummary == 0:
  os.execv('/usr/bin/ssh', ['/usr/bin/ssh', '-l', Str_userID, STR_p5] + ['rm', '-f', '*' + '&&' + 'wget', '\"http://cmswbm/cmsdb/servlet/RunSummary?RUN='+Str_run+'\"'])
else:
  time.sleep(1)
  os.read(fd_runSummary, 1000)
  time.sleep(1)
  os.write(fd_runSummary, Str_passwd)
  time.sleep(1)
  s = os.read(fd_runSummary,1 )
  s = os.read(fd_runSummary,1 )

os.system('scp '+Str_userID+'@'+STR_p5+':~/RunSummary* test/')
str_hltID = ''
file_runSummary = file('test/RunSummary?RUN='+Str_run,'r')
for str_runSummary in file_runSummary.readlines():
  if str_runSummary.find('HLT Key') >= 0:
     str_hltID = str_runSummary.split('HLTConfiguration?KEY=')[1].split('>')[0]
print 'DEBUG str_hltID: %s' %(str_hltID)
  
dt_newStart = datetime.datetime(2000,1,1,0,0,0)
dt_newEnd   = datetime.datetime(2000,1,1,0,0,0)
if ( Dict_runRegistry.has_key('START_TIME') and Dict_runRegistry.has_key('END_TIME') ):
  lstr_dateStart = Dict_runRegistry['START_TIME'].split(' ')[0].split('.')
  lstr_timeStart = Dict_runRegistry['START_TIME'].split(' ')[1].split(':')
  lstr_dateEnd   = Dict_runRegistry['END_TIME'].split(' ')[0].split('.')
  lstr_timeEnd   = Dict_runRegistry['END_TIME'].split(' ')[1].split(':')
  dt_oldStart    = datetime.datetime(int(lstr_dateStart[0]),int(lstr_dateStart[1]),int(lstr_dateStart[2]),int(lstr_timeStart[0]),int(lstr_timeStart[1]),int(lstr_timeStart[2]))
  dt_oldEnd      = datetime.datetime(int(lstr_dateEnd[0]),  int(lstr_dateEnd[1]),  int(lstr_dateEnd[2]),  int(lstr_timeEnd[0]),  int(lstr_timeEnd[1]),  int(lstr_timeEnd[2]))
  dt_newStart    = dt_oldStart - TD_shiftUTC
  dt_newEnd      = dt_oldEnd   - TD_shiftUTC
  dt_start       = str(dt_newStart).replace('-','.')
  dt_end         = str(dt_newEnd).replace('-','.')
  print 'DEBUG start time: \t%s \t%s \t%s' %(Dict_runRegistry['START_TIME'],dt_newStart,dt_start)
  print 'DEBUG end   time: \t%s \t%s \t%s' %(Dict_runRegistry['END_TIME'],dt_newEnd,dt_end)
  print 'DEBUG magnet'
  pid_magnetHistory, fd_magnetHistory = os.forkpty()
  if pid_magnetHistory == 0:
    os.execv('/usr/bin/ssh', ['/usr/bin/ssh', '-l', Str_userID, STR_p5] + ['wget', '\"http://cmswbm/cmsdb/servlet/MagnetHistory?TIME_BEGIN='+dt_start+'&TIME_END='+dt_end+'\"'])
  else:
    time.sleep(1)
    os.read(fd_magnetHistory, 1000)
    time.sleep(1)
    os.write(fd_magnetHistory, Str_passwd)
    time.sleep(1)
    s = os.read(fd_magnetHistory,1 )
    s = os.read(fd_magnetHistory,1 )

if not str_hltID == '':
  print 'DEBUG hlt'
  pid_hlt, fd_hlt = os.forkpty()
  if pid_hlt == 0:
    os.execv('/usr/bin/ssh', ['/usr/bin/ssh', '-l', Str_userID, STR_p5] + ['wget', '\"http://cmswbm/cmsdb/servlet/HLTConfiguration?KEY='+str_hltID+'\"'])
  else:
    time.sleep(1)
    os.read(fd_hlt, 1000)
    time.sleep(1)
    os.write(fd_hlt, Str_passwd)
    time.sleep(1)
    s = os.read(fd_hlt,1 )
    s = os.read(fd_hlt,1 )

os.system('scp '+Str_userID+'@'+STR_p5+':~/* test/')
# pid_scp, fd_scp = os.forkpty()
# if pid_scp == 0:
#   os.execv('/usr/bin/scp', ['/usr/bin/scp', Str_userID+'@'+STR_p5+':~/*', 'test/'])
# else:
#   time.sleep(1)
#   os.read(fd_scp, 1000)
#   time.sleep(1)
#   os.write(fd_scp, Str_passwd)
#   time.sleep(1)
#   res = ''
#   count = 0
#   s = os.read(fd_scp,1 )
#   while s:
#     if count >= 50:
#       break
#     res += s
#     s = os.read(fd_scp,1 )
#     count += 1
#   print res

# # get run DBS entries
# for str_dbsInstance in LSTR_dbsInstances:
#   Func_FillInfoDBS(str_dbsInstance)
# 
# # print run DBS info
# print
# print '> getRunInfo.py > * information from DBS *'
# print
# for str_dbsInstance in LSTR_dbsInstances:
#   print '> getRunInfo.py > DBS instance: %s' %(str_dbsInstance)
#   str_print = '> getRunInfo.py > ' + STR_headDatasets
#   for int_i in range(Dict_maxLenDbsDatasets[str_dbsInstance]-len(STR_headDatasets)):
#     str_print += ' '
#   str_print += ' '
#   int_length = len(str_print)
#   print '%s%s' %(str_print,STR_headFiles)
#   str_print = '                  '
#   for int_i in range(int_length-16+len(STR_headFiles)/2+INT_offset+8):
#     str_print += '-'
#   print str_print
#   for str_dbsDataset in Dict_dbsDatasets[str_dbsInstance]:
#     str_print = '                  ' + str_dbsDataset
#     for int_i in range(Dict_maxLenDbsDatasets[str_dbsInstance]-len(str_dbsDataset)):
#       str_print += ' '
#     str_print += ' '
#     for int_i in range(len(STR_headFiles)/2-len(DictDict_dbsDatasets[str_dbsInstance][str_dbsDataset])):
#       str_print += ' '
#     str_print += DictDict_dbsDatasets[str_dbsInstance][str_dbsDataset] + ' ('
#     for int_i in range(INT_offset-len(DictDict_dbsEvents[str_dbsInstance][str_dbsDataset])):
#       str_print += ' '
#     print '%s%s events)' %(str_print,DictDict_dbsEvents[str_dbsInstance][str_dbsDataset])
#   print  
