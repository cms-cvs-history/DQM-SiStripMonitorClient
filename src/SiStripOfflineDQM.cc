// -*- C++ -*-
//
// Package:    SiStripMonitorCluster
// Class:      SiStripOfflineDQM
// 
/**\class SiStripOfflineDQM SiStripOfflineDQM.cc DQM/SiStripMonitorCluster/src/SiStripOfflineDQM.cc

 Description: <one line class summary>

 Implementation:
     <Notes on implementation>
*/
//
// Original Author:  Samvel Khalatyan (ksamdev at gmail dot com)
//         Created:  Wed Oct  5 16:42:34 CET 2006
// $Id: SiStripOfflineDQM.cc,v 1.22 2006/08/22 22:13:00 dkcira Exp $
//
//

// Root UI that is used by original Client's SiStripActionExecuter
#include "FWCore/Framework/interface/Event.h"
#include "FWCore/Framework/interface/EventSetup.h"
#include "FWCore/ParameterSet/interface/ParameterSet.h"
#include "FWCore/MessageLogger/interface/MessageLogger.h"

#include "DQMServices/UI/interface/MonitorUIRoot.h"
#include "DQM/SiStripMonitorClient/interface/SiStripActionExecutor.h"

#include "DQM/SiStripMonitorClient/interface/SiStripOfflineDQM.h"

using edm::LogInfo;

SiStripOfflineDQM::SiStripOfflineDQM( const edm::ParameterSet &roPARAMETER_SET)
  : bVerbose( roPARAMETER_SET.getParameter<bool>( "verbose")),
    poMui( new MonitorUIRoot()) {
  // Create MessageSender
  LogInfo( "SiStripOfflineDQM");
}

SiStripOfflineDQM::~SiStripOfflineDQM() {
  delete poMui;
}

void SiStripOfflineDQM::beginJob( const edm::EventSetup &roEVENT_SETUP) {
  if( bVerbose) {
    LogInfo( "SiStripOfflineDQM") << "[beginJob] done";
  }
}

void SiStripOfflineDQM::analyze( const edm::Event      &roEVENT, 
				 const edm::EventSetup &roEVENT_SETUP) {
  if( bVerbose) {
    LogInfo( "SiStripOfflineDQM") << "[analyze] done";
  }
}


void SiStripOfflineDQM::endJob() {
  if( bVerbose) {
    LogInfo( "SiStripOfflineDQM") << "[endJob] start";
  }
  SiStripActionExecutor oActionExecutor;
  // Essential: creates some object that are used in createSummary
  oActionExecutor.readConfiguration();
  oActionExecutor.createSummary( poMui);
  if( bVerbose) {
    LogInfo( "SiStripOfflineDQM") << "[endJob] done";
  }
}
