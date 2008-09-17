import FWCore.ParameterSet.Config as cms

from DQM.SiStripMonitorHardware.buffer_hack_cfi import *
HardwareMonitor.rootFile = ''
HardwareMonitor.buildAllHistograms = False

# Condition DB Monitoring ###
from DQM.SiStripMonitorSummary.SiStripMonitorCondData_cfi import *

# SiStripMonitorDigi ####
from DQM.SiStripMonitorDigi.SiStripMonitorDigi_cfi import *
SiStripMonitorDigi.SelectAllDetectors = True

# SiStripMonitorCluster ####
# Clone for Sim Data
import DQM.SiStripMonitorCluster.SiStripMonitorCluster_cfi
SiStripMonitorClusterReal = DQM.SiStripMonitorCluster.SiStripMonitorCluster_cfi.SiStripMonitorCluster.clone()
SiStripMonitorClusterReal.OutputMEsInRootFile = False
SiStripMonitorClusterReal.SelectAllDetectors = True
# Clone for Real Data
import DQM.SiStripMonitorCluster.SiStripMonitorCluster_cfi
SiStripMonitorClusterSim = DQM.SiStripMonitorCluster.SiStripMonitorCluster_cfi.SiStripMonitorCluster.clone()
SiStripMonitorClusterSim.OutputMEsInRootFile = False
SiStripMonitorClusterSim.SelectAllDetectors = True
SiStripMonitorClusterSim.StripQualityLabel = 'test1'

# SiStripMonitorTrack ####
# Cline for Cosmic Track Finder
import DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi
SiStripMonitorTrack_cosmicTk = DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi.SiStripMonitorTrack.clone()
SiStripMonitorTrack_cosmicTk.TrackProducer = 'cosmictrackfinderP5'
SiStripMonitorTrack_cosmicTk.FolderName    = 'SiStrip/Tracks'
SiStripMonitorTrack_cosmicTk.Mod_On        = True
# Clone for CKF Tracks
import DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi
SiStripMonitorTrack_ckf = DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi.SiStripMonitorTrack.clone()
SiStripMonitorTrack_ckf.TrackProducer      = 'ctfWithMaterialTracksP5'
SiStripMonitorTrack_ckf.FolderName         = 'SiStrip/Tracks'
SiStripMonitorTrack_ckf.Mod_On             = True
# Clone fir Road Search  Tracks
import DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi
SiStripMonitorTrack_rs = DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi.SiStripMonitorTrack.clone()
SiStripMonitorTrack_rs.TrackProducer       = 'rsWithMaterialTracksP5'
SiStripMonitorTrack_rs.FolderName          = 'SiStrip/Tracks'
SiStripMonitorTrack_rs.Mod_On              = True
# Clone for Merged Tracks
import DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi
SiStripMonitorTrack_p5 = DQM.SiStripMonitorTrack.SiStripMonitorTrack_cfi.SiStripMonitorTrack.clone()
SiStripMonitorTrack_p5.TrackProducer       = 'trackCollectionP5'
SiStripMonitorTrack_p5.FolderName          = 'SiStrip/Tracks'
SiStripMonitorTrack_p5.Mod_On              = True

# TrackerMonitorTrack ####
# Clone for Cosmic Track Finder
import DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi
MonitorTrackResiduals_cosmicTk = DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi.MonitorTrackResiduals.clone()
MonitorTrackResiduals_cosmicTk.Tracks              = 'cosmictrackfinderP5'
MonitorTrackResiduals_cosmicTk.trajectoryInput     = 'cosmictrackfinderP5'
MonitorTrackResiduals_cosmicTk.OutputMEsInRootFile = False
MonitorTrackResiduals_cosmicTk.Mod_On              = False
# Clone for CKF Tracks
import DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi
MonitorTrackResiduals_ckf = DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi.MonitorTrackResiduals.clone()
MonitorTrackResiduals_ckf.Tracks                   = 'ctfWithMaterialTracksP5'
MonitorTrackResiduals_ckf.trajectoryInput          = 'ctfWithMaterialTracksP5'
MonitorTrackResiduals_ckf.OutputMEsInRootFile      = False
MonitorTrackResiduals_ckf.Mod_On                   = False
# Clone for Road Search  Tracks
import DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi
MonitorTrackResiduals_rs = DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi.MonitorTrackResiduals.clone()
MonitorTrackResiduals_rs.Tracks                    = 'rsWithMaterialTracksP5'
MonitorTrackResiduals_rs.trajectoryInput           = 'rsWithMaterialTracksP5'
MonitorTrackResiduals_rs.OutputMEsInRootFile       = False
MonitorTrackResiduals_rs.Mod_On                    = False
# Clone for Merged Tracks
import DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi
MonitorTrackResiduals_p5 = DQM.TrackerMonitorTrack.MonitorTrackResiduals_cfi.MonitorTrackResiduals.clone()
MonitorTrackResiduals_p5.Tracks                    = 'trackCollectionP5'
MonitorTrackResiduals_p5.trajectoryInput           = 'trackCollectionP5'
MonitorTrackResiduals_p5.OutputMEsInRootFile       = False
MonitorTrackResiduals_p5.Mod_On                    = False

# TrackingMonitor ####
# Clone for Cosmic Track Finder
import DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi
TrackMon_cosmicTk = DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi.TrackerCosmicTrackMon.clone()
TrackMon_cosmicTk.TrackProducer = 'cosmictrackfinderP5'
TrackMon_cosmicTk.AlgoName = 'CosmicTk'
TrackMon_cosmicTk.FolderName = 'SiStrip/Tracks'
# Clone for CKF Tracks
import DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi
TrackMon_ckf = DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi.TrackerCosmicTrackMon.clone()
TrackMon_ckf.TrackProducer = 'ctfWithMaterialTracksP5'
TrackMon_ckf.AlgoName = 'CKFTk'
TrackMon_ckf.FolderName = 'SiStrip/Tracks'

# Clone for Road Search  Tracks
import DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi
TrackMon_rs = DQM.TrackingMonitor.TrackerCosmicsTrackingMonitor_cfi.TrackerCosmicTrackMon.clone()
TrackMon_rs.TrackProducer = 'rsWithMaterialTracksP5'
TrackMon_rs.AlgoName = 'RSTk'
TrackMon_rs.FolderName = 'SiStrip/Tracks'


