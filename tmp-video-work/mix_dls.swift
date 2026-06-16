import Foundation
import AVFoundation

let videoURL = URL(fileURLWithPath: "/Users/zhenli/Documents/Codex/assets/dls-magician.mp4")
let voiceURL = URL(fileURLWithPath: "/Users/zhenli/Documents/Codex/tmp-video-work/dls-voice.m4a")
let outputURL = URL(fileURLWithPath: "/Users/zhenli/Documents/Codex/tmp-video-work/dls-magician-voice.mov")
try? FileManager.default.removeItem(at: outputURL)

let videoAsset = AVURLAsset(url: videoURL)
let voiceAsset = AVURLAsset(url: voiceURL)
let composition = AVMutableComposition()

let fullRange = CMTimeRange(start: .zero, duration: videoAsset.duration)

guard let sourceVideoTrack = videoAsset.tracks(withMediaType: .video).first,
      let compositionVideoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    fputs("Missing video track\n", stderr)
    exit(1)
}
try compositionVideoTrack.insertTimeRange(fullRange, of: sourceVideoTrack, at: .zero)
compositionVideoTrack.preferredTransform = sourceVideoTrack.preferredTransform

var audioParams: [AVMutableAudioMixInputParameters] = []

for sourceAudioTrack in videoAsset.tracks(withMediaType: .audio) {
    if let compositionAudioTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
        try compositionAudioTrack.insertTimeRange(fullRange, of: sourceAudioTrack, at: .zero)
        let params = AVMutableAudioMixInputParameters(track: compositionAudioTrack)
        params.setVolume(0.18, at: .zero)
        audioParams.append(params)
    }
}

if let voiceTrack = voiceAsset.tracks(withMediaType: .audio).first,
   let compositionVoiceTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
    let voiceStart = CMTime(seconds: 0.65, preferredTimescale: 600)
    let maxVoiceDuration = min(voiceAsset.duration, CMTimeSubtract(videoAsset.duration, voiceStart))
    if maxVoiceDuration.seconds > 0 {
        try compositionVoiceTrack.insertTimeRange(CMTimeRange(start: .zero, duration: maxVoiceDuration), of: voiceTrack, at: voiceStart)
        let params = AVMutableAudioMixInputParameters(track: compositionVoiceTrack)
        params.setVolume(1.0, at: .zero)
        audioParams.append(params)
    }
}

let audioMix = AVMutableAudioMix()
audioMix.inputParameters = audioParams

guard let export = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
    fputs("Could not create export session\n", stderr)
    exit(1)
}
export.outputURL = outputURL
export.outputFileType = .mov
export.shouldOptimizeForNetworkUse = true
export.audioMix = audioMix

let semaphore = DispatchSemaphore(value: 0)
export.exportAsynchronously {
    semaphore.signal()
}
semaphore.wait()

if export.status != .completed {
    fputs("Export failed: \(export.status.rawValue) \(String(describing: export.error))\n", stderr)
    exit(1)
}
