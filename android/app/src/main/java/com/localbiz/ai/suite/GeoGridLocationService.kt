package com.localbiz.ai.suite

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.location.LocationManager

/**
 * GeoGridLocationService: Native telemetry for 5x5 GPS local SEO rank grids.
 * Computes precise radial coordinate offsets (lat/lng meters) for local store ranking audits.
 */
class GeoGridLocationService {

    @SuppressLint("MissingPermission")
    fun getImmediateCoordinates(context: Context): Pair<Double, Double> {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        var bestLocation: Location? = null

        val providers = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
        for (provider in providers) {
            try {
                val loc = locationManager?.getLastKnownLocation(provider)
                if (loc != null && (bestLocation == null || loc.accuracy < bestLocation.accuracy)) {
                    bestLocation = loc
                }
            } catch (e: SecurityException) {
                // Ignore permissions in fallback
            }
        }

        return if (bestLocation != null) {
            Pair(bestLocation.latitude, bestLocation.longitude)
        } else {
            // Default center fallback (Bangalore Central Tech Hub)
            Pair(12.9716, 77.5946)
        }
    }

    /**
     * Calculates 5x5 Grid Node Offsets around center latitude and longitude
     */
    fun calculate5x5GridNodes(centerLat: Double, centerLng: Double, stepMeters: Double = 1000.0): List<Triple<Int, Double, Double>> {
        val nodes = mutableListOf<Triple<Int, Double, Double>>()
        val earthRadius = 6378137.0 // in meters

        var nodeIndex = 1
        for (row in -2..2) {
            for (col in -2..2) {
                val dLat = (row * stepMeters) / earthRadius * (180.0 / Math.PI)
                val dLng = (col * stepMeters) / (earthRadius * Math.cos(Math.PI * centerLat / 180.0)) * (180.0 / Math.PI)

                val nodeLat = centerLat + dLat
                val nodeLng = centerLng + dLng
                nodes.add(Triple(nodeIndex++, nodeLat, nodeLng))
            }
        }
        return nodes
    }
}
