#ifndef SiStripAnalyser_H
#define SiStripAnalyser_H

/** \class SiStripAnalyser
 * *
 *  SiStrip SiStripAnalyser
 *  $Date: 2007/08/13 18:01:35 $
 *  $Revision: 1.6 $
 *  \author  S. Dutta INFN-Pisa
 *   
 */

#include "FWCore/Framework/interface/EDAnalyzer.h"
#include "FWCore/ParameterSet/interface/ParameterSet.h"

#include "EventFilter/Utilities/interface/ModuleWeb.h"

#include "DQMServices/Daemon/interface/MonitorDaemon.h"
#include "FWCore/ServiceRegistry/interface/Service.h"
#include "FWCore/Framework/interface/ESHandle.h"
#include "FWCore/Framework/interface/LuminosityBlock.h"

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>

class MonitorUserInterface;
class DaqMonitorBEInterface;
class SiStripWebInterface;
class SiStripFedCabling;
class TrackerMapCreator;
 
class SiStripAnalyser: public edm::EDAnalyzer, public evf::ModuleWeb{

public:

  /// Constructor
  SiStripAnalyser(const edm::ParameterSet& ps);
  
  /// Destructor
  virtual ~SiStripAnalyser();
  /// Analyze
  void analyze(const edm::Event& e, const edm::EventSetup& eSetup);

  void defaultWebPage(xgi::Input *in, xgi::Output *out); 
  void publish(xdata::InfoSpace *){};
  //  void handleWebRequest(xgi::Input *in, xgi::Output *out); 

protected:

  /// BeginJob
  void beginJob(const edm::EventSetup& eSetup);

  /// BeginRun
  void beginRun(const edm::EventSetup& eSetup);


  /// Endjob
  void endJob();

  void beginLuminosityBlock(edm::LuminosityBlock const& lumiSeg, edm::EventSetup const& context) ;

  /// DQM Client Diagnostic
  void endLuminosityBlock(edm::LuminosityBlock const& lumiSeg, edm::EventSetup const& c);

  /// Save histograms to a root file

  void saveAll();

private:

  void createFedTrackerMap();

  int nLumiBlock;

  DaqMonitorBEInterface* dbe;
  MonitorUserInterface* mui_;

  edm::ParameterSet parameters;
  SiStripWebInterface* sistripWebInterface_;

  int tkMapFrequency_;
  int summaryFrequency_;
  int fileSaveFrequency_;
  unsigned int collationFlag_;
  unsigned int runNumber_;
  edm::ESHandle< SiStripFedCabling > fedCabling_;
  TrackerMapCreator* trackerMapCreator_;
  bool defaultPageCreated_;
};


#endif